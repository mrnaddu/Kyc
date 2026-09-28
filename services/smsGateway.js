/**
 * SMS Gateway Service
 * Priority order: 2Factor.in → Textbelt → Fast2SMS → Twilio
 * Zero external npm dependencies — pure fetch API.
 */

async function sendSmsOtp(phoneNumber, otp) {
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  if (cleanPhone.length !== 10) {
    throw new Error("Invalid Indian mobile number. Must be exactly 10 digits.");
  }

  const twofactorKey = process.env.TWOFACTOR_API_KEY;
  const textbeltKey  = process.env.TEXTBELT_API_KEY;
  const fast2smsKey  = process.env.FAST2SMS_API_KEY;
  const twilioSid    = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken  = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom   = process.env.TWILIO_PHONE_NUMBER;

  const message = `Your Karnataka e-KYC OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`;

  // ── 1. 2Factor.in (Primary — India SMS OTP) ──────────────────────────────
  if (twofactorKey) {
    console.log(`[SMS Gateway] Sending via 2Factor.in SMS to +91${cleanPhone}...`);
    try {
      // AUTOGEN2 uses 2Factor's standard DLT-approved SMS template (no voice fallback) and returns the generated OTP
      const url = `https://2factor.in/API/V1/${twofactorKey}/SMS/${cleanPhone}/AUTOGEN2`;
      const response = await fetch(url, { method: "POST" });
      const result   = await response.json();
      console.log("[2Factor Response]:", result);

      if (result.Status === "Success") {
        return {
          success:   true,
          provider:  "2Factor",
          sessionId: result.Details,
          otp:       result.OTP, // Actual OTP sent in the SMS message
          message:   `SMS OTP sent to +91${cleanPhone}`
        };
      } else {
        console.warn("[2Factor] Failed:", result.Details);
        // Fall through to next gateway
      }
    } catch (err) {
      console.error("[2Factor Error]:", err.message);
    }
  }

  // ── 2. Textbelt ───────────────────────────────────────────────────────────
  // Get your key at https://textbelt.com  (use "textbelt" for 1 free test SMS)
  if (textbeltKey) {
    console.log(`[SMS Gateway] Sending via Textbelt to +91${cleanPhone}...`);
    try {
      const response = await fetch("https://textbelt.com/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone:   `+91${cleanPhone}`,
          message: message,
          key:     textbeltKey
        })
      });

      const result = await response.json();
      console.log("[Textbelt Response]:", result);

      if (result.success) {
        return {
          success:   true,
          provider:  "Textbelt",
          textId:    result.textId,
          quotaRemaining: result.quotaRemaining,
          message:   `SMS sent to +91${cleanPhone}`
        };
      } else {
        console.warn("[Textbelt] Failed:", result.error);
        return { success: false, provider: "Textbelt", error: result.error };
      }
    } catch (err) {
      console.error("[Textbelt Error]:", err.message);
      return { success: false, provider: "Textbelt", error: err.message };
    }
  }

  // ── 3. Fast2SMS (fallback) ────────────────────────────────────────────────
  if (fast2smsKey) {
    console.log(`[SMS Gateway] Sending via Fast2SMS to +91${cleanPhone}...`);
    try {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "authorization": fast2smsKey,
          "Content-Type":  "application/json"
        },
        body: JSON.stringify({
          route:    "q",
          message:  message,
          language: "english",
          numbers:  cleanPhone
        })
      });

      const result = await response.json();
      console.log("[Fast2SMS Response]:", result);

      if (result.return) {
        return { success: true, provider: "Fast2SMS", message: "SMS sent to " + cleanPhone };
      } else {
        return { success: false, provider: "Fast2SMS", error: result.message || "Fast2SMS error" };
      }
    } catch (err) {
      console.error("[Fast2SMS Error]:", err.message);
      return { success: false, provider: "Fast2SMS", error: err.message };
    }
  }

  // ── 4. Twilio (fallback) ──────────────────────────────────────────────────
  if (twilioSid && twilioToken && twilioFrom) {
    console.log(`[SMS Gateway] Sending via Twilio to +91${cleanPhone}...`);
    try {
      const auth     = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method:  "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type":  "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            To:   `+91${cleanPhone}`,
            From: twilioFrom,
            Body: message
          }).toString()
        }
      );

      const result = await response.json();
      if (response.ok) {
        return { success: true, provider: "Twilio", message: "SMS sent to " + cleanPhone };
      } else {
        return { success: false, provider: "Twilio", error: result.message };
      }
    } catch (err) {
      console.error("[Twilio Error]:", err.message);
      return { success: false, provider: "Twilio", error: err.message };
    }
  }

  // ── 4. No gateway configured ──────────────────────────────────────────────
  console.log(`[SMS Gateway] No API key configured. OTP for +91${cleanPhone}: [ ${otp} ]`);
  return {
    success:      false,
    noGatewayKey: true,
    message:      "No SMS gateway key set in .env. Add TEXTBELT_API_KEY to enable live SMS."
  };
}

module.exports = { sendSmsOtp };
