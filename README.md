# Karnataka Ration Card e-KYC

A mobile-friendly Node.js application for looking up Karnataka ration-card records and demonstrating an e-KYC workflow with member selection, photo capture, and certificate generation.

## Features

- Live Karnataka Ahara ration-card lookup
- Persistent JSON cache with configurable expiry
- Captcha-protected card searches
- English and Kannada interface
- Aadhaar OTP flow with optional SMS providers
- Camera-based photo capture
- e-KYC certificate generation
- Responsive mobile-style interface and launch screen

## Requirements

- Node.js 18 or newer
- Internet access for the Karnataka Ahara portal and optional external services

## Run locally

```bash
git clone https://github.com/mrnaddu/Kyc.git
cd Kyc
npm install
cp .env.example .env
node server.js
```

On Windows PowerShell, copy the environment file with:

```powershell
Copy-Item .env.example .env
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Android test APK

An installable Android test build is available from the repository's [Releases](https://github.com/mrnaddu/Kyc/releases) page.

The current APK connects to `http://172.16.1.30:3000`. To test it:

1. Connect the Android phone and server computer to the same Wi-Fi network.
2. Start the server with `node server.js`.
3. Install and open the APK on the phone.
4. Allow camera access when prompted for photo verification.

The local IP address can change when reconnecting to Wi-Fi. If that happens, update `APP_URL` in `app/build.gradle` and create a new build.

## Configuration

The application works without an SMS provider and prints development OTP information to the server console. To enable SMS delivery, configure one of the supported providers in `.env`:

```env
PORT=3000
CACHE_TTL_MINUTES=30

TWOFACTOR_API_KEY=
TEXTBELT_API_KEY=
FAST2SMS_API_KEY=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

See [`.env.example`](.env.example) for all available options. Never commit your `.env` file or API credentials.

## Project structure

```text
public/                   Browser interface
services/aadhaarAuth.js   Aadhaar validation and OTP sessions
services/cacheManager.js  Memory and JSON-file cache
services/karnatakaAhara.js Karnataka Ahara portal gateway
services/kycEngine.js     Captcha, name matching, and certificates
services/smsGateway.js    SMS provider integrations
server.js                 Express server and API routes
```

## Main API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/captcha` | Generate a security captcha |
| `POST` | `/api/verify-rc` | Retrieve ration-card details |
| `POST` | `/api/aadhaar/send-otp` | Create and send an Aadhaar OTP |
| `POST` | `/api/aadhaar/verify-otp` | Verify an Aadhaar OTP |
| `POST` | `/api/confirm-kyc` | Complete KYC and issue a certificate |

## Important notice

This project is a demonstration and is not an official Government of Karnataka or UIDAI service. The current photo step captures an image but does not perform biometric face matching. Do not use it for production identity verification without appropriate security, privacy, authentication, and regulatory controls.

## License

Licensed under the [MIT License](LICENSE).
