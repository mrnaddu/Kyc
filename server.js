const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Lightweight .env file loader (zero external dependencies) - Must run before any services
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const { fetchKarnatakaRationCard } = require("./services/karnatakaAhara");
const { 
  generateCaptcha, 
  verifyCaptcha, 
  calculateNameMatchScore, 
  generateKycCertificate 
} = require("./services/kycEngine");
const {
  isValidAadhaar,
  generateAadhaarOtp,
  verifyAadhaarOtp,
  registerAadhaarPhone,
  getRegisteredPhoneForAadhaar
} = require("./services/aadhaarAuth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Temporary session stores
const cardSessionStore = new Map();
const authenticatedUsers = new Map();

/**
 * Configure SMS Gateway Key (Fast2SMS / Twilio) on the fly
 */
app.post("/api/settings/sms-gateway", (req, res) => {
  try {
    const { fast2smsKey, twilioSid, twilioToken, twilioFrom } = req.body;
    if (fast2smsKey) {
      process.env.FAST2SMS_API_KEY = fast2smsKey.trim();
      console.log("[SMS Gateway] Configured live Fast2SMS API key.");
    }
    if (twilioSid && twilioToken) {
      process.env.TWILIO_ACCOUNT_SID = twilioSid.trim();
      process.env.TWILIO_AUTH_TOKEN = twilioToken.trim();
      process.env.TWILIO_PHONE_NUMBER = twilioFrom ? twilioFrom.trim() : "";
      console.log("[SMS Gateway] Configured live Twilio credentials.");
    }
    res.json({ success: true, message: "SMS gateway credentials updated." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Configure Registered Mobile Phone for Aadhaar
 */
app.post("/api/settings/registered-phone", (req, res) => {
  try {
    const { aadhaarNumber, phone } = req.body;
    if (!phone || phone.replace(/\D/g, "").length !== 10) {
      return res.status(400).json({ success: false, message: "Valid 10-digit Indian mobile number is required." });
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (aadhaarNumber) {
      registerAadhaarPhone(aadhaarNumber, cleanPhone);
      console.log(`[Aadhaar Directory] Linked UID ${aadhaarNumber.slice(-4)} to Mobile: +91-${cleanPhone}`);
    } else {
      process.env.USER_PHONE = cleanPhone;
      console.log(`[Aadhaar Directory] Set global default registered mobile: +91-${cleanPhone}`);
    }
    res.json({ success: true, message: `Registered mobile successfully configured to +91-${cleanPhone}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * 1. Aadhaar Authentication: Send OTP (with real SMS dispatch)
 */
app.post("/api/aadhaar/send-otp", async (req, res) => {
  try {
    const { aadhaarNumber, phone } = req.body;
    const result = await generateAadhaarOtp(aadhaarNumber, phone);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * 2. Aadhaar Authentication: Verify OTP
 */
app.post("/api/aadhaar/verify-otp", (req, res) => {
  try {
    const { otpToken, otp } = req.body;
    const result = verifyAadhaarOtp(otpToken, otp);
    
    // Store authenticated user session
    authenticatedUsers.set(result.authToken, {
      aadhaarLast4: result.aadhaarLast4,
      verifiedAt: result.verifiedAt
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * 3. Security Captcha
 */
app.get("/api/captcha", (req, res) => {
  try {
    const captcha = generateCaptcha();
    res.json({ success: true, ...captcha });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to generate captcha" });
  }
});

/**
 * 4. Verify Karnataka Ration Card Number with Cache & Live Scraper
 */
app.post("/api/verify-rc", async (req, res) => {
  try {
    const { rcNumber, captchaInput, captchaToken, authToken, forceRefresh } = req.body;
    const cleanRc = rcNumber ? rcNumber.trim().toUpperCase() : "";

    if (!cleanRc || !/^[A-Z0-9]{5,25}$/.test(cleanRc)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Karnataka Ration Card Number format."
      });
    }

    const hasActiveSession = cardSessionStore.has(cleanRc);

    // If this is NOT an in-session live refresh, enforce security captcha
    if (!(forceRefresh && hasActiveSession)) {
      if (!captchaInput || !captchaToken) {
        return res.status(400).json({
          success: false,
          message: "Please enter the security captcha."
        });
      }

      const isCaptchaValid = verifyCaptcha(captchaToken, captchaInput);
      if (!isCaptchaValid) {
        return res.status(400).json({
          success: false,
          captchaError: true,
          message: "Invalid or expired captcha. Please try again."
        });
      }
    }

    // ── Direct Live Query: ahara.karnataka.gov.in (No Caching) ──────────
    console.log(`[Ahara Live] Querying live portal directly for RC: ${cleanRc}...`);
    const result = await fetchKarnatakaRationCard(cleanRc);
    
    // Attach Aadhaar verification context if available
    const authUser = authToken ? authenticatedUsers.get(authToken) : null;
    if (authUser) {
      result.data.authenticatedAadhaarLast4 = authUser.aadhaarLast4;
    }

    // Active session store for certificate generation in this transaction only
    cardSessionStore.set(cleanRc, result.data);

    res.json({
      success: true,
      data: result.data,
      fromCache: false,
      isLiveGateway: true,
      lastSynced: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error verifying card:", err.message);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch ration card details"
    });
  }
});

/**
 * Check if a card is already present in cache
 */
app.get("/api/rc-cache-status/:rcNumber", (req, res) => {
  res.json({
    cached: false,
    ageSeconds: 0,
    lastSynced: null
  });
});

/**
 * 5. Complete KYC & Issue Certificate
 */
app.post("/api/confirm-kyc", (req, res) => {
  try {
    const { rcNumber, memberId, applicantName, aadhaarLast4 } = req.body;

    const cleanRc = rcNumber ? rcNumber.trim().toUpperCase() : "";
    const cardData = cardSessionStore.get(cleanRc);
    if (!cardData) {
      return res.status(400).json({
        success: false,
        message: "Session expired. Please search your Ration Card again."
      });
    }

    const member = cardData.members.find(m => m.id === memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Selected family member not found on this card."
      });
    }

    // 1. Check Name Similarity
    const matchScore = calculateNameMatchScore(applicantName, member.nameEn);
    if (matchScore < 50) {
      return res.status(400).json({
        success: false,
        message: `Name mismatch! Entered '${applicantName}' does not match member '${member.nameEn}' (${matchScore}% match).`
      });
    }

    // 2. Cross-check Aadhaar last 4 digits
    if (aadhaarLast4 && member.aadhaarLast4 && member.aadhaarLast4 !== "XXXX") {
      if (aadhaarLast4.trim() !== member.aadhaarLast4) {
        return res.status(400).json({
          success: false,
          message: `Aadhaar verification failed! Last 4 digits (${aadhaarLast4}) do not match records for ${member.nameEn} (${member.aadhaarLast4}).`
        });
      }
    }

    // 3. Generate Official KYC Certificate
    const certificate = generateKycCertificate(cardData, member, {
      applicantName,
      nameMatchScore: matchScore
    });

    // 4. Update member KYC status in session
    member.ekyc = "VERIFIED";
    member.isKycComplete = true;
    member.verifiedAt = certificate.verifiedAt;
    member.kycReferenceId = certificate.kycReferenceId;

    res.json({
      success: true,
      certificate
    });
  } catch (err) {
    console.error("KYC confirmation error:", err);
    res.status(500).json({
      success: false,
      message: "Internal KYC processing error"
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Karnataka Nanna Seva (Aadhaar & Ration) Server Active!`);
  console.log(`  Local URL: http://localhost:${PORT}                  `);
  console.log(`=======================================================`);
});
