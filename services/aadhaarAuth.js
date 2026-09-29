/**
 * Aadhaar Authentication & OTP Security Service
 * Handles 12-digit Aadhaar validation, automatic phone number detection from UID,
 * 6-digit OTP generation, phone masking, live SMS dispatch, and session authentication tokens.
 */

const crypto = require("crypto");
const { sendSmsOtp } = require("./smsGateway");

// Active OTP sessions
const otpStore = new Map();

// Registered Aadhaar Directory (UIDAI CIDR Simulation)
// Maps 12-digit Aadhaar UIDs to their verified registered mobile numbers
const aadhaarDirectory = new Map();
if (process.env.AADHAAR_3756_PHONE) aadhaarDirectory.set("554433223756", process.env.AADHAAR_3756_PHONE.replace(/\D/g, ""));
if (process.env.AADHAAR_5308_PHONE) aadhaarDirectory.set("554433225308", process.env.AADHAAR_5308_PHONE.replace(/\D/g, ""));

/**
 * Check if an Aadhaar UID has a real linked phone number (not a fallback)
 */
function hasLinkedPhone(cleanAadhaar) {
  if (aadhaarDirectory.has(cleanAadhaar)) return true;
  if (process.env.USER_PHONE && process.env.USER_PHONE.replace(/\D/g, "").length === 10) return true;
  if (process.env.DEFAULT_REGISTERED_PHONE && process.env.DEFAULT_REGISTERED_PHONE.replace(/\D/g, "").length === 10) return true;
  return false; // only the fake fallback is available
}

/**
 * Automatically detects or resolves the registered mobile number linked to an Aadhaar card
 */
function getRegisteredPhoneForAadhaar(cleanAadhaar) {
  // 1. Check explicit UID directory
  if (aadhaarDirectory.has(cleanAadhaar)) {
    return aadhaarDirectory.get(cleanAadhaar);
  }

  // 2. Global user phone configured in environment
  if (process.env.USER_PHONE && process.env.USER_PHONE.replace(/\D/g, "").length === 10) {
    return process.env.USER_PHONE.replace(/\D/g, "");
  }
  if (process.env.DEFAULT_REGISTERED_PHONE && process.env.DEFAULT_REGISTERED_PHONE.replace(/\D/g, "").length === 10) {
    return process.env.DEFAULT_REGISTERED_PHONE.replace(/\D/g, "");
  }

  // 3. No real phone linked — return null so caller knows to ask
  return null;
}

/**
 * Allows dynamic registration or linking of a phone number to an Aadhaar UID
 */
function registerAadhaarPhone(aadhaarNumber, phone) {
  const cleanAadhaar = aadhaarNumber.replace(/\s+/g, "");
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length === 10) {
    aadhaarDirectory.set(cleanAadhaar, cleanPhone);
    return true;
  }
  return false;
}

/**
 * Validates 12-digit Aadhaar format
 */
function isValidAadhaar(aadhaarNumber) {
  if (!aadhaarNumber) return false;
  const clean = aadhaarNumber.replace(/\s+/g, "");
  return /^[2-9]\d{11}$/.test(clean);
}

/**
 * Generate 6-digit OTP, automatically detect phone number from Aadhaar, send live SMS, and return session token.
 * If no phone is linked yet, returns { needsPhone: true } to prompt the user.
 */
async function generateAadhaarOtp(aadhaarNumber, customPhone = null) {
  const cleanAadhaar = aadhaarNumber.replace(/\s+/g, "");
  
  if (!isValidAadhaar(cleanAadhaar)) {
    throw new Error("Invalid Aadhaar number. Must be a valid 12-digit UID.");
  }

  // If user provided their phone (first-time linking), register it immediately
  const cleanCustomPhone = customPhone ? customPhone.replace(/\D/g, "") : null;
  if (cleanCustomPhone && cleanCustomPhone.length === 10) {
    aadhaarDirectory.set(cleanAadhaar, cleanCustomPhone);
    console.log(`[Aadhaar Directory] Linked UID XXXX-XXXX-${cleanAadhaar.slice(-4)} to +91-${cleanCustomPhone}`);
  }

  // Check if a real phone is registered for this Aadhaar
  const registeredPhone = getRegisteredPhoneForAadhaar(cleanAadhaar);

  // No phone linked — prompt the user to enter their registered number
  if (!registeredPhone) {
    return {
      success:    false,
      needsPhone: true,
      maskedAadhaar: `XXXX XXXX ${cleanAadhaar.slice(-4)}`,
      message:    "No mobile number linked to this Aadhaar. Please enter your registered mobile number."
    };
  }

  const last4      = cleanAadhaar.slice(-4);
  const maskedMobile = `••••••${registeredPhone.slice(-4)}`;

  // Generate 6-digit numeric OTP (default fallback)
  let otp        = Math.floor(100000 + Math.random() * 900000).toString();
  const otpToken = crypto.randomUUID();

  // Attempt real cellular SMS delivery
  let smsDeliveryResult = null;
  if (registeredPhone.length === 10) {
    smsDeliveryResult = await sendSmsOtp(registeredPhone, otp);
    // If the SMS provider (2Factor AUTOGEN2) issued a specific verified SMS OTP, use it
    if (smsDeliveryResult && smsDeliveryResult.otp) {
      otp = smsDeliveryResult.otp.toString();
    }
  }

  otpStore.set(otpToken, {
    aadhaarNumber: cleanAadhaar,
    maskedAadhaar: `XXXX-XXXX-${last4}`,
    otp,
    phone: registeredPhone,
    maskedMobile,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  // Cleanup expired tokens
  for (const [key, value] of otpStore.entries()) {
    if (value.expiresAt < Date.now()) {
      otpStore.delete(key);
    }
  }

  console.log(`[Aadhaar Security Gate] UID XXXX-XXXX-${last4} -> Registered Mobile: +91-${registeredPhone} -> OTP: [ ${otp} ]`);

  return {
    success:    true,
    otpToken,
    maskedAadhaar: `XXXX XXXX ${last4}`,
    maskedMobile,
    devOtp:     otp,
    smsResult:  smsDeliveryResult
  };
}

/**
 * Verify submitted OTP
 */
function verifyAadhaarOtp(otpToken, userOtp) {
  if (!otpToken || !userOtp) {
    throw new Error("OTP and session token are required.");
  }

  const session = otpStore.get(otpToken);
  if (!session) {
    throw new Error("OTP session expired or invalid. Please request a new OTP.");
  }

  if (session.expiresAt < Date.now()) {
    otpStore.delete(otpToken);
    throw new Error("OTP has expired. Please request a new OTP.");
  }

  if (session.otp !== userOtp.trim()) {
    throw new Error("Invalid OTP entered. Please check and try again.");
  }

  // OTP is valid - consume it and return an authenticated token
  otpStore.delete(otpToken);

  const authToken = `AUTH-UID-${crypto.randomBytes(16).toString("hex")}`;
  return {
    success: true,
    authToken,
    aadhaarLast4: session.aadhaarNumber.slice(-4),
    maskedAadhaar: session.maskedAadhaar,
    verifiedAt: new Date().toISOString()
  };
}

module.exports = {
  isValidAadhaar,
  generateAadhaarOtp,
  verifyAadhaarOtp,
  getRegisteredPhoneForAadhaar,
  registerAadhaarPhone
};
