/**
 * Karnataka ePDS e-KYC Application Controller
 * Modern GovTech Architecture — Pure Ration Card Workflow
 * Bilingual (Kannada & English) with SpeechSynthesis Audio Guidance
 */

// Bilingual Localization Dictionary
const translations = {
  EN: {
    appTitle: "Ration Card e-KYC",
    langButton: "ಕನ್ನಡ",
    steps: [
      "Step 1 of 4: Enter Ration Card Number",
      "Step 2 of 4: Select Your Name",
      "Step 3 of 4: Take Your Photo",
      "Step 4 of 4: e-KYC Certificate"
    ],
    deptBadgeText: "Food & Civil Supplies Department • Government of Karnataka",
    rcSearchHeading: "Ration Card e-KYC",
    rcSearchSubheading: "Enter your 12-digit ration card number to verify your family details.",
    rcInputLabel: "Ration Card Number",
    scanRCText: "Scan Card",
    rcInputPlaceholder: "12-digit card number",
    captchaHeaderLabel: "Security Code",
    refreshCaptchaText: "New Code",
    consentTextLabel: "I agree to verify my ration card details for e-KYC.",
    fetchBtnText: "Find My Ration Card",
    pvcRcLabel: "Ration Card Number",
    pvcHofLabel: "Head of Family",
    pvcSchemeLabel: "Card Type",
    rosterHeaderLabel: "Select Your Name",
    topNavBack: "Back",
    topNavHome: "Home",
    backBtnText: "Back",
    bioBackText: "Back",
    proceedBioText: "Continue to Photo Verification",
    bioHeading: "Face Photo Verification",
    bioSubheading: "Look into the camera and keep your face inside the circle to verify your identity.",
    verifyingApplicantLabel: "Applicant Name",
    cameraPrompt: "Position your face in the circle",
    captureBtnText: "Take Photo",
    retakeBtnText: "Retake Photo",
    issuePassBtnText: "Complete e-KYC",
    certMainHeading: "e-KYC Completed Successfully!",
    certRefLabel: "Certificate ID",
    certCitizenLabel: "Citizen Name:",
    certHofLabel: "Card Owner:",
    certRelationLabel: "Relationship:",
    certAadhaarLabel: "Aadhaar Number:",
    certRcLabel: "Ration Card:",
    certSourceLabel: "Status:",
    printCertText: "Download / Print",
    newSessionText: "Done",
    scannerModalTitle: "Scan Ration Card",
    scannerModalDesc: "Hold your ration card steady in the frame",
    scannerStatusText: "Scanning card...",
    
    // Citizen-Friendly Loading Strings
    loadingTitle: "Finding Your Ration Card",
    loadingSubtitle: "Please wait a moment...",
    loadingDisclaimer: "Please keep this screen open. This takes just a few seconds.",
    loadSteps: [
      "Checking card number...",
      "Finding family details...",
      "Preparing your card..."
    ],

    // Friendly Error Messages
    errorModalTitle: "Could Not Find Ration Card",
    errorModalSubtitle: "Please check your 12-digit ration card number and try again. If the server is busy, please try again in a moment.",
    errorRetryBtnText: "Try Again",
    errorDismissBtnText: "Cancel",
    rcErrorInvalid: "Please enter all 12 digits of your Ration Card number.",
    captchaErrorInvalid: "Security code was incorrect. Please type the new code shown.",
    rosterSelectPrompt: "Please tap on your name in the list to continue.",
    ekycVerifiedBadge: "KYC Done ✓",
    ekycPendingBadge: "KYC Pending"
  },
  KN: {
    appTitle: "ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿ",
    langButton: "English",
    steps: [
      "ಹಂತ 1/4: ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
      "ಹಂತ 2/4: ನಿಮ್ಮ ಹೆಸರನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      "ಹಂತ 3/4: ಮುಖದ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",
      "ಹಂತ 4/4: ಇ-ಕೆವೈಸಿ ಪ್ರಮಾಣಪತ್ರ"
    ],
    deptBadgeText: "ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ • ಕರ್ನಾಟಕ ಸರ್ಕಾರ",
    rcSearchHeading: "ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿ",
    rcSearchSubheading: "ನಿಮ್ಮ 12-ಅಂಕಿಯ ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ ವಿವರಗಳನ್ನು ಪಡೆಯಿರಿ.",
    rcInputLabel: "ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ",
    scanRCText: "ಕಾರ್ಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    rcInputPlaceholder: "12-ಅಂಕಿಯ ಸಂಖ್ಯೆ",
    captchaHeaderLabel: "ಸೆಕ್ಯುರಿಟಿ ಕೋಡ್",
    refreshCaptchaText: "ಹೊಸ ಕೋಡ್",
    consentTextLabel: "ಇ-ಕೆವೈಸಿಗಾಗಿ ನನ್ನ ಪಡಿತರ ಚೀಟಿ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ.",
    fetchBtnText: "ಪಡಿತರ ಚೀಟಿ ಹುಡುಕಿ",
    pvcRcLabel: "ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ",
    pvcHofLabel: "ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರು",
    pvcSchemeLabel: "ಕಾರ್ಡ್ ವಿಧ",
    rosterHeaderLabel: "ನಿಮ್ಮ ಹೆಸರನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    topNavBack: "ಹಿಂದಕ್ಕೆ",
    topNavHome: "ಮುಖಪುಟ",
    backBtnText: "ಹಿಂದಕ್ಕೆ",
    bioBackText: "ಹಿಂದಕ್ಕೆ",
    proceedBioText: "ಫೋಟೋ ಪರಿಶೀಲನೆಗೆ ಮುಂದುವರಿಯಿರಿ",
    bioHeading: "ಮುಖದ ಫೋಟೋ ಪರಿಶೀಲನೆ",
    bioSubheading: "ಕ್ಯಾಮರಾವನ್ನು ನೋಡಿ ಮತ್ತು ನಿಮ್ಮ ಮುಖವನ್ನು ವೃತ್ತದೊಳಗೆ ಇರಿಸಿ.",
    verifyingApplicantLabel: "ಅರ್ಜಿದಾರರ ಹೆಸರು",
    cameraPrompt: "ಮುಖವನ್ನು ವೃತ್ತದೊಳಗೆ ಇರಿಸಿ",
    captureBtnText: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
    retakeBtnText: "ಮತ್ತೆ ತೆಗೆಯಿರಿ",
    issuePassBtnText: "ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳಿಸಿ",
    certMainHeading: "ಇ-ಕೆವೈಸಿ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ!",
    certRefLabel: "ಪ್ರಮಾಣಪತ್ರ ಸಂಖ್ಯೆ",
    certCitizenLabel: "ನಾಗರಿಕರ ಹೆಸರು:",
    certHofLabel: "ಕಾರ್ಡ್ ಮಾಲೀಕರು:",
    certRelationLabel: "ಸಂಬಂಧ:",
    certAadhaarLabel: "ಆಧಾರ್ ಸಂಖ್ಯೆ:",
    certRcLabel: "ಪಡಿತರ ಚೀಟಿ:",
    certSourceLabel: "ಪರಿಶೀಲನೆ ಸ್ಥಿತಿ:",
    printCertText: "ಪ್ರಮಾಣಪತ್ರ ಮುದ್ರಿಸಿ",
    newSessionText: "ಪೂರ್ಣಗೊಂಡಿದೆ",
    scannerModalTitle: "ಪಡಿತರ ಚೀಟಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    scannerModalDesc: "ನಿಮ್ಮ ಕಾರ್ಡ್ ಅನ್ನು ಚೌಕಟ್ಟಿನ ಒಳಗೆ ಇರಿಸಿ",
    scannerStatusText: "ಕಾರ್ಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    
    // Citizen-Friendly Loading Strings (Kannada)
    loadingTitle: "ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ",
    loadingSubtitle: "ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಕಾಯಿರಿ...",
    loadingDisclaimer: "ದಯವಿಟ್ಟು ಈ ಪುಟವನ್ನು ಮುಚ್ಚಬೇಡಿ. ಕೆಲವೇ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಮುಗಿಯುತ್ತದೆ.",
    loadSteps: [
      "ಕಾರ್ಡ್ ಸಂಖ್ಯೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
      "ಕುಟುಂಬದ ವಿವರಗಳನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
      "ವಿವರಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ..."
    ],

    // Friendly Error Messages (Kannada)
    errorModalTitle: "ಪಡಿತರ ಚೀಟಿ ವಿವರ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ",
    errorModalSubtitle: "ದಯವಿಟ್ಟು ನಿಮ್ಮ 12-ಅಂಕಿಯ ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ. ಸರ್ವರ್ ಕಾರ್ಯನಿರತವಾಗಿದ್ದರೆ ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.",
    errorRetryBtnText: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    errorDismissBtnText: "ರದ್ದುಮಾಡಿ",
    rcErrorInvalid: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿಯ 12 ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ.",
    captchaErrorInvalid: "ಸೆಕ್ಯುರಿಟಿ ಕೋಡ್ ಸರಿಯಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಹೊಸ ಕೋಡ್ ನಮೂದಿಸಿ.",
    rosterSelectPrompt: "ದಯವಿಟ್ಟು ಮುಂದುವರಿಯಲು ಪಟ್ಟಿಯಿಂದ ನಿಮ್ಮ ಹೆಸರನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    ekycVerifiedBadge: "ಇ-ಕೆವೈಸಿ ಮುಗಿದಿದೆ ✓",
    ekycPendingBadge: "ಇ-ಕೆವೈಸಿ ಬಾಕಿ ಇದೆ"
  }
};

// Application State
const appState = {
  step: 0, // 0: RC Lookup, 1: Family Roster, 2: Biometric, 3: Certificate
  currentLang: "EN",
  captchaToken: null,
  cardData: null,
  selectedMember: null,
  capturedPhotoData: null,
  cameraStream: null,
  scannerStream: null,
  loadingInterval: null
};

// Uses the native Android engine when bundled in the standalone APK,
// while preserving normal HTTP API calls for browser use.
const nativePendingRequests = new Map();
window.NativeKycClient = {
  resolve(requestId, result) {
    const pending = nativePendingRequests.get(requestId);
    if (!pending) return;
    window.clearTimeout(pending.timeoutId);
    nativePendingRequests.delete(requestId);
    pending.resolve({
      ok: result.success === true,
      status: result.success === true ? 200 : 400,
      json: async () => result
    });
  }
};

function appFetch(url, options = {}) {
  if (!window.AndroidKyc || typeof window.AndroidKyc.request !== "function") {
    return fetch(url, options);
  }

  return new Promise((resolve, reject) => {
    const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const timeoutId = window.setTimeout(() => {
      nativePendingRequests.delete(requestId);
      reject(new Error("The Android verification service timed out."));
    }, 45000);

    nativePendingRequests.set(requestId, { resolve, reject, timeoutId });
    try {
      window.AndroidKyc.request(requestId, url, options.body || "{}");
    } catch (error) {
      window.clearTimeout(timeoutId);
      nativePendingRequests.delete(requestId);
      reject(error);
    }
  });
}

// DOM References
const viewRCLookup = document.getElementById("viewRCLookup");
const viewFamilyRoster = document.getElementById("viewFamilyRoster");
const viewBiometric = document.getElementById("viewBiometric");
const viewCertificate = document.getElementById("viewCertificate");

const stepProgressBar = document.getElementById("stepProgressBar");
const stepLabelText = document.getElementById("stepLabelText");
const stepPercentText = document.getElementById("stepPercentText");

// Navigation
const btnNavBack = document.getElementById("btnNavBack");
const btnNavHome = document.getElementById("btnNavHome");
const topNavBackLabel = document.getElementById("topNavBackLabel");
const topNavHomeLabel = document.getElementById("topNavHomeLabel");
const btnBackToRC = document.getElementById("btnBackToRC");
const btnBackToRoster = document.getElementById("btnBackToRoster");
const btnNewSession = document.getElementById("btnNewSession");

// RC Form Elements
const rcInput = document.getElementById("rcInput");
const rcDigitCounter = document.getElementById("rcDigitCounter");
const rcInputError = document.getElementById("rcInputError");
const rcInputErrorText = document.getElementById("rcInputErrorText");
const rcCardContainer = document.getElementById("rcCardContainer");

const btnRefreshCaptcha = document.getElementById("btnRefreshCaptcha");
const captchaBox = document.getElementById("captchaBox");
const captchaInput = document.getElementById("captchaInput");
const captchaInputError = document.getElementById("captchaInputError");
const captchaInputErrorText = document.getElementById("captchaInputErrorText");
const captchaCardContainer = document.getElementById("captchaCardContainer");

const btnFetchRationCard = document.getElementById("btnFetchRationCard");


// Loading Overlay Elements
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingTitle = document.getElementById("loadingTitle");
const loadingSubtitle = document.getElementById("loadingSubtitle");
const loadingProgressStage = document.getElementById("loadingProgressStage");
const loadingProgressPercent = document.getElementById("loadingProgressPercent");
const loadingProgressBar = document.getElementById("loadingProgressBar");
const loadingDisclaimerText = document.getElementById("loadingDisclaimerText");

// Error Modal Elements
const errorModal = document.getElementById("errorModal");
const errorModalTitle = document.getElementById("errorModalTitle");
const errorModalSubtitle = document.getElementById("errorModalSubtitle");
const btnErrorRetry = document.getElementById("btnErrorRetry");
const btnErrorDismiss = document.getElementById("btnErrorDismiss");

// Document Scanner
const scannerModal = document.getElementById("scannerModal");
const btnCloseScanner = document.getElementById("btnCloseScanner");
const scannerVideo = document.getElementById("scannerVideo");
const scannerModalTitle = document.getElementById("scannerModalTitle");
const btnScanRC = document.getElementById("btnScanRC");

// Biometric Camera
const webcamVideo = document.getElementById("webcamVideo");
const snapshotCanvas = document.getElementById("snapshotCanvas");
const capturedPhotoPreview = document.getElementById("capturedPhotoPreview");
const faceOvalOverlay = document.getElementById("faceOvalOverlay");
const cameraPrompt = document.getElementById("cameraPrompt");
const btnCapturePhoto = document.getElementById("btnCapturePhoto");
const btnRetakePhoto = document.getElementById("btnRetakePhoto");
const btnSubmitKYC = document.getElementById("btnSubmitKYC");

// Language Toggle
const langToggleBtn = document.getElementById("langToggleBtn");
const langButtonLabel = document.getElementById("langButtonLabel");

// Toast
const toastNotification = document.getElementById("toastNotification");
const toastText = document.getElementById("toastText");
const toastIcon = document.getElementById("toastIcon");

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  bindEventHandlers();
  initInputInteractions();
  loadCaptcha();
  setStep(0);
  dismissLaunchScreen();

  const updateButton = document.getElementById("btnCheckUpdates");
  if (updateButton) {
    updateButton.addEventListener("click", () => {
      if (window.AndroidKyc && typeof window.AndroidKyc.checkForUpdates === "function") {
        window.AndroidKyc.checkForUpdates();
      } else {
        window.open("https://github.com/mrnaddu/Kyc-Releases/releases/latest", "_blank", "noopener");
      }
    });
  }

  const bannerUpdateBtn = document.getElementById("btnBannerUpdate");
  if (bannerUpdateBtn) {
    bannerUpdateBtn.addEventListener("click", () => {
      if (window.AndroidKyc && typeof window.AndroidKyc.checkForUpdates === "function") {
        window.AndroidKyc.checkForUpdates();
      } else {
        window.open("https://github.com/mrnaddu/Kyc-Releases/releases/latest", "_blank", "noopener");
      }
    });
  }

  window.showUpdateNotification = function(version) {
    const banner = document.getElementById("updateBanner");
    const versionEl = document.getElementById("updateBannerVersion");
    if (banner && versionEl) {
      versionEl.textContent = "v" + version.replace(/^v/i, "");
      banner.classList.remove("hidden");
    }
  };
});

function dismissLaunchScreen() {
  const launchScreen = document.getElementById("appLaunchScreen");
  if (!launchScreen) return;

  const minimumDisplayTime = 1600;
  window.setTimeout(() => {
    launchScreen.classList.add("is-hiding");
    window.setTimeout(() => launchScreen.remove(), 500);
  }, minimumDisplayTime);
}

// Toast Helper
let toastTimeout = null;
function showToast(message, type = "info") {
  if (!toastNotification) return;
  clearTimeout(toastTimeout);
  toastText.textContent = message;
  
  if (type === "error") {
    toastNotification.className = "mx-4 mt-3 p-3.5 rounded-xl text-xs font-semibold border flex items-center gap-2.5 transition-all bg-rose-50 border-rose-200 text-rose-800 shadow-md";
    toastIcon.className = "fa-solid fa-circle-exclamation text-rose-600 text-sm shrink-0";
  } else if (type === "success") {
    toastNotification.className = "mx-4 mt-3 p-3.5 rounded-xl text-xs font-semibold border flex items-center gap-2.5 transition-all bg-emerald-50 border-emerald-200 text-emerald-800 shadow-md";
    toastIcon.className = "fa-solid fa-circle-check text-emerald-600 text-sm shrink-0";
  } else {
    toastNotification.className = "mx-4 mt-3 p-3.5 rounded-xl text-xs font-semibold border flex items-center gap-2.5 transition-all bg-slate-900 border-slate-800 text-white shadow-md";
    toastIcon.className = "fa-solid fa-circle-info text-amber-400 text-sm shrink-0";
  }

  toastNotification.classList.remove("hidden");
  toastTimeout = setTimeout(hideToast, 4500);
}

function hideToast() {
  if (toastNotification) {
    toastNotification.classList.add("hidden");
  }
}

// Interactive Real-Time Input Validation & Counters
function initInputInteractions() {
  // Real-time digit counter & auto-format for Ration Card
  rcInput.addEventListener("input", async (e) => {
    // Only permit digits
    const digits = e.target.value.replace(/\D/g, "");
    e.target.value = digits;

    clearRcError();

    // Update real-time counter
    if (digits.length === 12) {
      rcDigitCounter.className = "text-[10px] font-mono text-emerald-600 font-bold";
      rcDigitCounter.textContent = "12 / 12 ✓";
    } else {
      rcDigitCounter.className = "text-[10px] font-mono text-slate-400";
      rcDigitCounter.textContent = `${digits.length} / 12`;
    }
  });

  // Auto-uppercase captcha input
  captchaInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
    clearCaptchaError();
  });
}

function showRcError(msg) {
  rcInputErrorText.textContent = msg || translations[appState.currentLang].rcErrorInvalid;
  rcInputError.classList.remove("hidden");
  rcCardContainer.classList.add("input-error-state", "shake-error");
  setTimeout(() => rcCardContainer.classList.remove("shake-error"), 400);
  rcInput.focus();
}

function clearRcError() {
  rcInputError.classList.add("hidden");
  rcCardContainer.classList.remove("input-error-state");
}

function showCaptchaError(msg) {
  captchaInputErrorText.textContent = msg || translations[appState.currentLang].captchaErrorInvalid;
  captchaInputError.classList.remove("hidden");
  captchaCardContainer.classList.add("input-error-state", "shake-error");
  setTimeout(() => captchaCardContainer.classList.remove("shake-error"), 400);
  captchaInput.focus();
}

function clearCaptchaError() {
  captchaInputError.classList.add("hidden");
  captchaCardContainer.classList.remove("input-error-state");
}

// Multi-Stage Loading Screen Animation
function showLoadingScreen() {
  const t = translations[appState.currentLang];
  loadingTitle.textContent = t.loadingTitle;
  loadingSubtitle.textContent = t.loadingSubtitle;
  loadingDisclaimerText.innerHTML = `<i class="fa-solid fa-shield-halved text-emerald-600 mr-1"></i> ${t.loadingDisclaimer}`;

  // Reset steps
  // Reset steps
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`loadStep${i}`);
    const textEl = document.getElementById(`loadStep${i}Text`);
    if (textEl && t.loadSteps[i - 1]) textEl.textContent = t.loadSteps[i - 1];
    if (el) {
      if (i === 1) {
        el.className = "loading-step-item active flex items-center gap-2 font-medium text-slate-800";
        el.innerHTML = `<i class="fa-solid fa-circle-notch animate-spin text-slate-900 text-xs shrink-0"></i> <span>${t.loadSteps[0]}</span>`;
      } else {
        el.className = "loading-step-item pending flex items-center gap-2 text-slate-400";
        el.innerHTML = `<i class="fa-regular fa-circle text-xs shrink-0"></i> <span>${t.loadSteps[i - 1]}</span>`;
      }
    }
  }

  loadingProgressBar.style.width = "30%";
  loadingProgressPercent.textContent = "30%";
  loadingProgressStage.textContent = t.loadSteps[0];
  loadingOverlay.classList.remove("hidden");

  // Dynamic Multi-Stage Timers to keep user visually engaged
  let stage = 1;
  clearInterval(appState.loadingInterval);
  appState.loadingInterval = setInterval(() => {
    stage++;
    if (stage === 2) {
      advanceLoadingStage(2, "65%", t.loadSteps[1]);
    } else if (stage === 3) {
      advanceLoadingStage(3, "90%", t.loadSteps[2]);
      clearInterval(appState.loadingInterval);
    }
  }, 2200);
}

function advanceLoadingStage(stepNum, percent, label) {
  // Mark previous as completed
  const prev = document.getElementById(`loadStep${stepNum - 1}`);
  if (prev) {
    prev.className = "loading-step-item done flex items-center gap-2 text-emerald-700 font-medium";
    const prevIcon = prev.querySelector("i");
    if (prevIcon) prevIcon.className = "fa-solid fa-circle-check text-xs shrink-0 text-emerald-600";
  }

  // Activate current
  const curr = document.getElementById(`loadStep${stepNum}`);
  if (curr) {
    curr.className = "loading-step-item active flex items-center gap-2 font-medium text-slate-800";
    const currIcon = curr.querySelector("i");
    if (currIcon) currIcon.className = "fa-solid fa-circle-notch animate-spin text-slate-900 text-xs shrink-0";
  }

  loadingProgressBar.style.width = percent;
  loadingProgressPercent.textContent = percent;
  loadingProgressStage.textContent = label;
}

function hideLoadingScreen() {
  clearInterval(appState.loadingInterval);
  loadingProgressBar.style.width = "100%";
  loadingProgressPercent.textContent = "100%";
  setTimeout(() => {
    loadingOverlay.classList.add("hidden");
  }, 350);
}

// Friendly Error Modal Controller
function showErrorModal(title, message) {
  const t = translations[appState.currentLang];
  errorModalTitle.textContent = title || t.errorModalTitle;
  errorModalSubtitle.textContent = message || t.errorModalSubtitle;
  document.getElementById("errorRetryBtnText").textContent = t.errorRetryBtnText;
  document.getElementById("errorDismissBtnText").textContent = t.errorDismissBtnText;

  errorModal.classList.remove("hidden");
}

function hideErrorModal() {
  errorModal.classList.add("hidden");
}

// Language Engine
function applyLanguage(lang) {
  appState.currentLang = lang;
  const t = translations[lang];

  document.documentElement.lang = lang === "KN" ? "kn" : "en";
  langButtonLabel.textContent = t.langButton;
  document.getElementById("appTitleText").textContent = t.appTitle;
  if (topNavBackLabel) topNavBackLabel.textContent = t.topNavBack;
  topNavHomeLabel.textContent = t.topNavHome;

  // RC Search View
  const deptBadge = document.getElementById("deptBadgeText");
  if (deptBadge) deptBadge.textContent = t.deptBadgeText;
  document.getElementById("rcSearchHeading").textContent = t.rcSearchHeading;
  document.getElementById("rcSearchSubheading").textContent = t.rcSearchSubheading;
  document.getElementById("rcInputLabel").innerHTML = `${t.rcInputLabel} <span class="text-rose-500">*</span>`;
  document.getElementById("scanRCText").textContent = t.scanRCText;
  rcInput.placeholder = t.rcInputPlaceholder;
  document.getElementById("captchaHeaderLabel").textContent = t.captchaHeaderLabel;
  document.getElementById("refreshCaptchaText").textContent = t.refreshCaptchaText;
  document.getElementById("consentTextLabel").innerHTML = t.consentTextLabel;
  document.getElementById("fetchBtnText").textContent = t.fetchBtnText;

  // Roster View
  document.getElementById("pvcRcLabel").textContent = t.pvcRcLabel;
  document.getElementById("pvcHofLabel").textContent = t.pvcHofLabel;
  document.getElementById("pvcSchemeLabel").textContent = t.pvcSchemeLabel;
  document.getElementById("rosterHeaderLabel").textContent = t.rosterHeaderLabel;
  document.getElementById("backBtnText").textContent = t.backBtnText;
  document.getElementById("proceedBioText").textContent = t.proceedBioText;

  // Biometric View
  document.getElementById("bioHeading").textContent = t.bioHeading;
  document.getElementById("bioSubheading").textContent = t.bioSubheading;
  document.getElementById("verifyingApplicantLabel").textContent = t.verifyingApplicantLabel;
  cameraPrompt.textContent = t.cameraPrompt;
  document.getElementById("captureBtnText").textContent = t.captureBtnText;
  document.getElementById("retakeBtnText").textContent = t.retakeBtnText;
  document.getElementById("bioBackText").textContent = t.bioBackText;
  document.getElementById("issuePassBtnText").textContent = t.issuePassBtnText;

  // Certificate View
  document.getElementById("certMainHeading").textContent = t.certMainHeading;
  document.getElementById("certRefLabel").textContent = t.certRefLabel;
  document.getElementById("certCitizenLabel").textContent = t.certCitizenLabel;
  const certHofLabel = document.getElementById("certHofLabel");
  if (certHofLabel) certHofLabel.textContent = t.certHofLabel;
  const certRelationLabel = document.getElementById("certRelationLabel");
  if (certRelationLabel) certRelationLabel.textContent = t.certRelationLabel;
  document.getElementById("certAadhaarLabel").textContent = t.certAadhaarLabel;
  document.getElementById("certRcLabel").textContent = t.certRcLabel;
  document.getElementById("certSourceLabel").textContent = t.certSourceLabel;
  document.getElementById("printCertText").textContent = t.printCertText;
  document.getElementById("newSessionText").textContent = t.newSessionText;

  // Scanner Modal
  scannerModalTitle.textContent = t.scannerModalTitle;
  document.getElementById("scannerModalDesc").textContent = t.scannerModalDesc;
  document.getElementById("scannerStatusText").textContent = t.scannerStatusText;

  // Re-render roster if already loaded
  if (appState.cardData) {
    renderFamilyRoster(appState.cardData);
  }

  // Update current step label
  stepLabelText.textContent = t.steps[appState.step] || t.steps[0];
}

// Document Camera OCR Scanner
function openDocumentScanner(mode) {
  const t = translations[appState.currentLang];
  scannerModalTitle.textContent = appState.currentLang === "KN" ? "ಪಡಿತರ ಚೀಟಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ" : "Scan Karnataka Ration Card";
  scannerModal.classList.remove("hidden");

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      appState.scannerStream = stream;
      scannerVideo.srcObject = stream;
    })
    .catch(err => {
      console.warn("Document camera simulation:", err);
    });

  // Simulated rapid OCR
  setTimeout(() => {
    closeDocumentScanner();
    rcInput.value = "260300261661";
    rcDigitCounter.className = "text-[10px] font-mono text-emerald-600 font-bold";
    rcDigitCounter.textContent = "12 / 12 ✓";
    clearRcError();
    showToast(appState.currentLang === "KN" ? "ಪಡಿತರ ಚೀಟಿ ಯಶಸ್ವಿಯಾಗಿ ಸ್ಕ್ಯಾನ್ ಆಗಿದೆ: 260300261661" : "Ration Card scanned: 260300261661", "success");
    captchaInput.focus();
  }, 2000);
}

function closeDocumentScanner() {
  scannerModal.classList.add("hidden");
  if (appState.scannerStream) {
    appState.scannerStream.getTracks().forEach(t => t.stop());
    appState.scannerStream = null;
  }
}

// Event Bindings
function bindEventHandlers() {
  // Global Header Back & Home Buttons
  if (btnNavBack) btnNavBack.addEventListener("click", handleNavBack);
  if (btnNavHome) btnNavHome.addEventListener("click", handleNavHome);

  // Language Toggle
  langToggleBtn.addEventListener("click", () => {
    const nextLang = appState.currentLang === "EN" ? "KN" : "EN";
    applyLanguage(nextLang);
    showToast(nextLang === "KN" ? "ಭಾಷೆ: ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ" : "Language: English", "info");
  });

  // Scanner Triggers
  btnScanRC.addEventListener("click", () => openDocumentScanner("rc"));
  btnCloseScanner.addEventListener("click", closeDocumentScanner);

  // RC Search & Captcha Refresh
  btnRefreshCaptcha.addEventListener("click", loadCaptcha);
  btnFetchRationCard.addEventListener("click", handleFetchRationCard);

  // Error Modal Actions
  btnErrorRetry.addEventListener("click", () => {
    hideErrorModal();
    handleFetchRationCard();
  });
  btnErrorDismiss.addEventListener("click", hideErrorModal);

  // Step Navigation
  if (btnBackToRC) btnBackToRC.addEventListener("click", handleNavBack);
  document.getElementById("btnProceedToBiometric").addEventListener("click", () => {
    if (!appState.selectedMember) {
      const rosterContainer = document.getElementById("rosterListContainer");
      if (rosterContainer) {
        rosterContainer.classList.add("shake-error");
        setTimeout(() => rosterContainer.classList.remove("shake-error"), 400);
      }
      showToast(translations[appState.currentLang].rosterSelectPrompt, "error");
      return;
    }
    updateCandidateDisplay();
    setStep(2);
    startCamera();
  });

  // Biometric Camera Controls
  btnCapturePhoto.addEventListener("click", takeSnapshot);
  btnRetakePhoto.addEventListener("click", resetCamera);
  btnSubmitKYC.addEventListener("click", handleSubmitFinalKYC);
  if (btnBackToRoster) btnBackToRoster.addEventListener("click", handleNavBack);

  // Certificate / Reset
  if (btnNewSession) btnNewSession.addEventListener("click", handleNavHome);
}

// Load Security Captcha
async function loadCaptcha() {
  const icon = document.getElementById("captchaSpinIcon");
  if (icon) icon.classList.add("animate-spin");
  try {
    captchaBox.innerHTML = `<span class="text-xs text-slate-400">Loading...</span>`;
    const res = await appFetch("/api/captcha");
    const data = await res.json();
    if (data.success) {
      appState.captchaToken = data.token;
      captchaBox.innerHTML = `<img src="${data.imageUri}" alt="Captcha" class="h-full w-full object-contain" />`;
      captchaInput.value = "";
      clearCaptchaError();
    }
  } catch (err) {
    captchaBox.innerHTML = `<span class="text-xs text-rose-500 font-semibold">Offline</span>`;
  } finally {
    if (icon) setTimeout(() => icon.classList.remove("animate-spin"), 400);
  }
}

// Fetch Ration Card with Multi-Stage Loading & Friendly Error Handling
async function handleFetchRationCard() {
  hideToast();
  clearRcError();
  clearCaptchaError();

  const rcNumber = rcInput.value.trim();
  const captchaText = captchaInput.value.trim();
  const consent = document.getElementById("pdsConsentCheck").checked;

  if (!consent) {
    showToast(appState.currentLang === "KN" ? "ದಯವಿಟ್ಟು ಮುಂದುವರಿಯಲು ಸಮ್ಮತಿ ಪೆಟ್ಟಿಗೆಯನ್ನು ಗುರುತು ಮಾಡಿ." : "Please check the consent box to continue.", "error");
    return;
  }

  // 1. Validate 12-digit Ration Card ID
  if (!rcNumber || rcNumber.length !== 12 || !/^\d+$/.test(rcNumber)) {
    showRcError(translations[appState.currentLang].rcErrorInvalid);
    return;
  }

  // 2. Validate Security Captcha
  if (!captchaText) {
    showCaptchaError(translations[appState.currentLang].captchaErrorInvalid);
    return;
  }

  btnFetchRationCard.disabled = true;
  showLoadingScreen();

  try {
    const res = await appFetch("/api/verify-rc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rcNumber,
        captchaInput: captchaText,
        captchaToken: appState.captchaToken,
        forceRefresh: false
      })
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      hideLoadingScreen();
      
      // Captcha mismatch
      if (result.captchaError) {
        showCaptchaError(translations[appState.currentLang].captchaErrorInvalid);
        loadCaptcha();
        return;
      }

      // Record not found or Ahara gateway error
      showErrorModal(
        translations[appState.currentLang].errorModalTitle,
        result.message || translations[appState.currentLang].errorModalSubtitle
      );
      loadCaptcha();
      return;
    }

    // Success! Smoothly finish loading and transition to Member Selection
    setTimeout(() => {
      hideLoadingScreen();
      appState.cardData = result.data;
      renderFamilyRoster(result.data);
      setStep(1);
    }, 400);

  } catch (err) {
    hideLoadingScreen();
    showErrorModal(
      translations[appState.currentLang].errorModalTitle,
      translations[appState.currentLang].errorModalSubtitle
    );
    loadCaptcha();
  } finally {
    btnFetchRationCard.disabled = false;
  }
}

// Render Roster & Member Selection
function renderFamilyRoster(data) {
  document.getElementById("pvcRcNumber").textContent = data.rcNumber;
  const isKn = appState.currentLang === "KN";
  const hofName = isKn ? (data.headOfFamily?.nameKn || data.headOfFamily?.nameEn || "Hazira") : (data.headOfFamily?.nameEn || "Hazira");
  document.getElementById("pvcHofName").textContent = hofName;
  const schemeEl = document.getElementById("pvcSchemeValue");
  if (schemeEl) schemeEl.textContent = data.cardType || data.cardTypeLabel || "PHH / BPL Category";
  document.getElementById("memberCountText").textContent = isKn ? `${data.members.length} ಸದಸ್ಯರು` : `${data.members.length} Members`;

  const container = document.getElementById("rosterListContainer");
  container.innerHTML = "";
  appState.selectedMember = null;

  const isKannada = appState.currentLang === "KN";

  data.members.forEach((member, index) => {
    // Default select first member or head of family
    const isDefault = (index === 0);
    if (isDefault && !appState.selectedMember) {
      appState.selectedMember = member;
    }

    const card = document.createElement("div");
    card.className = `p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between member-card ${
      isDefault 
        ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500 shadow-xs" 
        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
    }`;

    const displayName = isKannada ? (member.nameKn || member.nameEn) : member.nameEn;
    const relationName = isKannada 
      ? (member.relation === "HEAD" || member.relation === "HEAD OF FAMILY" ? "ಮುಖ್ಯಸ್ಥರು" : "ಸದಸ್ಯರು")
      : member.relation;
    const initials = (member.nameEn || "KA").slice(0, 2).toUpperCase();

    const isVerified = (member.ekyc === "VERIFIED" || member.isKycComplete === true);
    const kycBadge = isVerified 
      ? `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs"><i class="fa-solid fa-circle-check text-[9px] text-emerald-600"></i> ${translations[appState.currentLang].ekycVerifiedBadge}</span>`
      : `<span class="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1"><i class="fa-solid fa-clock text-[8px] text-slate-400"></i> ${translations[appState.currentLang].ekycPendingBadge}</span>`;

    card.innerHTML = `
      <div class="member-card-main flex items-center gap-3">
        <input type="radio" name="memberSelect" value="${member.id}" ${isDefault ? "checked" : ""} class="text-slate-900 focus:ring-slate-900 h-4 w-4" />
        <div class="w-8 h-8 rounded-full ${isDefault ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'} flex items-center justify-center font-bold text-xs shrink-0 font-mono member-avatar">
          ${initials}
        </div>
        <div class="member-card-details">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-xs text-slate-900">${displayName}</span>
            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">${relationName}</span>
            ${kycBadge}
          </div>
          <div class="member-meta flex items-center gap-2 mt-1 text-[11px] text-slate-500">
            <span class="member-aadhaar text-emerald-700 font-semibold font-mono text-[10px] flex items-center gap-1">
              <i class="fa-solid fa-fingerprint text-[9px]"></i> Aadhaar: •••• ${member.aadhaarLast4}
            </span>
            <span class="member-meta-separator">•</span>
            <span class="member-demographics text-[10px] text-slate-400 font-mono">${member.gender} | Age: ${member.age}</span>
          </div>
        </div>
      </div>
      <div class="selection-pill ${isDefault ? '' : 'hidden'} text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
        <i class="fa-solid fa-check text-[9px]"></i> Selected
      </div>
    `;

    card.addEventListener("click", () => {
      document.querySelectorAll(".member-card").forEach(c => {
        c.className = "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between member-card border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50";
        const av = c.querySelector(".member-avatar");
        if (av) av.className = "w-8 h-8 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 font-mono member-avatar";
        const pill = c.querySelector(".selection-pill");
        if (pill) pill.classList.add("hidden");
      });

      card.className = "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between member-card border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500 shadow-xs";
      const av = card.querySelector(".member-avatar");
      if (av) av.className = "w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono member-avatar";
      const pill = card.querySelector(".selection-pill");
      if (pill) pill.classList.remove("hidden");

      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      appState.selectedMember = member;
      updateCandidateDisplay();
    });

    container.appendChild(card);
  });

  updateCandidateDisplay();
}

function updateCandidateDisplay() {
  if (!appState.selectedMember) return;
  const isKn = appState.currentLang === "KN";
  const nameEl = document.getElementById("bioApplicantName");
  const aadhaarEl = document.getElementById("bioAadhaarPill");

  if (nameEl) nameEl.textContent = isKn ? (appState.selectedMember.nameKn || appState.selectedMember.nameEn) : appState.selectedMember.nameEn;
  if (aadhaarEl) aadhaarEl.textContent = `Aadhaar: •••• ${appState.selectedMember.aadhaarLast4}`;
}

// Biometric Camera Controls
function startCamera() {
  resetCamera();
  navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } })
    .then(stream => {
      appState.cameraStream = stream;
      webcamVideo.srcObject = stream;
      cameraPrompt.textContent = translations[appState.currentLang].cameraPrompt;
    })
    .catch(err => {
      console.warn("Webcam access error:", err);
      showToast(appState.currentLang === "KN" ? "ಕ್ಯಾಮರಾ ಲಭ್ಯವಿಲ್ಲ (ಮಾದರಿ ಫೋಟೋ ಬಳಸಲಾಗುತ್ತಿದೆ)" : "Camera unavailable. Using sample photo mode.", "info");
      simulateCameraCapture();
    });
}

function stopCamera() {
  if (appState.cameraStream) {
    appState.cameraStream.getTracks().forEach(track => track.stop());
    appState.cameraStream = null;
  }
}

function resetCamera() {
  capturedPhotoPreview.classList.add("hidden");
  webcamVideo.classList.remove("hidden");
  faceOvalOverlay.classList.remove("hidden");
  btnCapturePhoto.classList.remove("hidden");
  btnRetakePhoto.classList.add("hidden");
  btnSubmitKYC.disabled = true;
  appState.capturedPhotoData = null;
  cameraPrompt.textContent = translations[appState.currentLang].cameraPrompt;
}

function takeSnapshot() {
  // Flash effect
  const overlay = document.querySelector(".camera-overlay");
  if (overlay) {
    overlay.classList.add("camera-flash");
    setTimeout(() => overlay.classList.remove("camera-flash"), 400);
  }

  if (webcamVideo.videoWidth > 0) {
    snapshotCanvas.width = webcamVideo.videoWidth;
    snapshotCanvas.height = webcamVideo.videoHeight;
    const ctx = snapshotCanvas.getContext("2d");
    ctx.drawImage(webcamVideo, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
    const photoUrl = snapshotCanvas.toDataURL("image/jpeg", 0.85);

    capturedPhotoPreview.src = photoUrl;
    capturedPhotoPreview.classList.remove("hidden");
    webcamVideo.classList.add("hidden");
    faceOvalOverlay.classList.add("hidden");

    btnCapturePhoto.classList.add("hidden");
    btnRetakePhoto.classList.remove("hidden");
    btnSubmitKYC.disabled = false;
    appState.capturedPhotoData = photoUrl;

    cameraPrompt.textContent = appState.currentLang === "KN" ? "ಫೋಟೋ ತೆಗೆಯಲಾಗಿದೆ ✓" : "Photo captured ✓";
    showToast(appState.currentLang === "KN" ? "ಫೋಟೋ ಯಶಸ್ವಿಯಾಗಿ ತೆಗೆಯಲಾಗಿದೆ." : "Photo captured successfully.", "success");
  } else {
    simulateCameraCapture();
  }
}

function simulateCameraCapture() {
  capturedPhotoPreview.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
  capturedPhotoPreview.classList.remove("hidden");
  webcamVideo.classList.add("hidden");
  faceOvalOverlay.classList.add("hidden");

  btnCapturePhoto.classList.add("hidden");
  btnRetakePhoto.classList.remove("hidden");
  btnSubmitKYC.disabled = false;
  appState.capturedPhotoData = capturedPhotoPreview.src;

  cameraPrompt.textContent = appState.currentLang === "KN" ? "ಫೋಟೋ ತೆಗೆಯಲಾಗಿದೆ ✓" : "Photo captured ✓";
}

// Final KYC Submission & Certificate Issuance
async function handleSubmitFinalKYC() {
  if (!appState.selectedMember || !appState.cardData) {
    showToast(appState.currentLang === "KN" ? "ದಯವಿಟ್ಟು ಮೊದಲಿನಿಂದ ಪ್ರಾರಂಭಿಸಿ." : "Please start from the beginning.", "error");
    return;
  }

  btnSubmitKYC.disabled = true;
  btnSubmitKYC.innerHTML = `<span class="inline-block animate-spin mr-1.5"><i class="fa-solid fa-spinner"></i></span> ${appState.currentLang === "KN" ? "ಪೂರ್ಣಗೊಳಿಸಲಾಗುತ್ತಿದೆ..." : "Completing e-KYC..."}`;

  try {
    const res = await appFetch("/api/confirm-kyc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rcNumber: appState.cardData.rcNumber,
        memberId: appState.selectedMember.id,
        applicantName: appState.selectedMember.nameEn,
        aadhaarLast4: appState.selectedMember.aadhaarLast4
      })
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      showToast(result.message || (appState.currentLang === "KN" ? "ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ." : "Could not complete e-KYC. Please try again."), "error");
      btnSubmitKYC.disabled = false;
      btnSubmitKYC.innerHTML = `<i class="fa-solid fa-check mr-1.5"></i> ${translations[appState.currentLang].issuePassBtnText}`;
      return;
    }

    // Synchronize member e-KYC status locally
    if (appState.selectedMember) {
      appState.selectedMember.ekyc = "VERIFIED";
      appState.selectedMember.isKycComplete = true;
      appState.selectedMember.verifiedAt = result.certificate.verifiedAt;
      appState.selectedMember.kycReferenceId = result.certificate.kycReferenceId;
    }

    renderCertificateView(result.certificate);
    stopCamera();
    setStep(3);

  } catch (err) {
    showToast(appState.currentLang === "KN" ? "ದೃಢೀಕರಣ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Could not complete e-KYC. Please try again.", "error");
  } finally {
    btnSubmitKYC.disabled = false;
    btnSubmitKYC.innerHTML = `<span>${translations[appState.currentLang].issuePassBtnText}</span> <i class="fa-solid fa-shield-check"></i>`;
  }
}

function renderCertificateView(cert) {
  document.getElementById("certRefText").textContent = cert.kycReferenceId;
  document.getElementById("certCitizenName").textContent = cert.beneficiary.memberNameEn;

  const hofEl = document.getElementById("certHofName");
  if (hofEl) {
    hofEl.textContent = cert.beneficiary.headOfFamily || appState.cardData?.headOfFamily?.nameEn || "Hazira";
  }

  const relEl = document.getElementById("certRelation");
  if (relEl) {
    relEl.textContent = cert.beneficiary.relationship || appState.selectedMember?.relation || "MEMBER";
  }

  const last4 = (cert.beneficiary.aadhaarMasked || "").slice(-4) || appState.selectedMember?.aadhaarLast4 || "XXXX";
  document.getElementById("certAadhaarStatus").textContent = `•••• ${last4} (${appState.currentLang === "KN" ? "ಪರಿಶೀಲಿಸಲಾಗಿದೆ ✓" : "Verified ✓"})`;
  document.getElementById("certRcDisplay").textContent = cert.beneficiary.rationCardNumber;
  document.getElementById("certTimestampText").textContent = new Date(cert.verifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
    `KA-KYC:${cert.kycReferenceId}:${cert.beneficiary.rationCardNumber}:${cert.beneficiary.memberNameEn}`
  )}`;
  document.getElementById("certQrImage").src = qrUrl;
}

// 4-Step Manager
function setStep(newStep) {
  hideToast();
  appState.step = newStep;

  [viewRCLookup, viewFamilyRoster, viewBiometric, viewCertificate].forEach(el => {
    if (el) el.classList.remove("active");
  });

  const stepsConfig = [
    { el: viewRCLookup, pct: 25 },
    { el: viewFamilyRoster, pct: 50 },
    { el: viewBiometric, pct: 75 },
    { el: viewCertificate, pct: 100 }
  ];

  const current = stepsConfig[newStep];
  if (current && current.el) {
    current.el.classList.add("active");
    stepLabelText.textContent = translations[appState.currentLang].steps[newStep] || "";
    stepPercentText.textContent = `${current.pct}%`;
    stepProgressBar.style.width = `${current.pct}%`;
  }

  updateNavBackVisibility();
}

// Navigation Controllers
function updateNavBackVisibility() {
  if (!btnNavBack) return;
  if (appState.step === 0) {
    btnNavBack.classList.add("hidden");
  } else {
    btnNavBack.classList.remove("hidden");
  }
}

function handleNavBack() {
  hideToast();
  hideErrorModal();
  if (appState.step === 1) {
    // Back from Family Roster to RC Search
    setStep(0);
    loadCaptcha();
  } else if (appState.step === 2) {
    // Back from Biometric to Family Roster
    stopCamera();
    setStep(1);
  } else if (appState.step === 3) {
    // Back from Certificate to Home
    handleNavHome();
  }
}

function handleNavHome() {
  hideToast();
  hideErrorModal();
  stopCamera();
  appState.cardData = null;
  appState.selectedMember = null;
  rcInput.value = "";
  captchaInput.value = "";
  rcDigitCounter.textContent = "0 / 12";
  rcDigitCounter.className = "text-[10px] font-mono text-slate-400";
  clearRcError();
  clearCaptchaError();
  setStep(0);
  loadCaptcha();
}
