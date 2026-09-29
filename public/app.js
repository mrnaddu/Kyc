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
    rcSearchSubheading: "Enter your ration card number to verify your family details.",
    rcInputLabel: "Ration Card Number",
    scanRCText: "Scan Card",
    rcInputPlaceholder: "Enter card number",
    captchaHeaderLabel: "Security Code",
    refreshCaptchaText: "New Code",
    tapToRefreshText: "tap ↻",
    captchaHelpText: "Type 5 characters shown on left",
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
    scannerModalTitle: "Scan Ration Card Barcode / QR",
    scannerModalDesc: "Align the barcode or QR code on your ration card",
    scannerStatusText: "Align barcode or QR code within the frame...",
    scanUploadPhotoText: "Upload Card Photo / Screenshot",

    // Home Facilities Guide
    homeGuideTitle: "Ration Benefits & Shop Info",
    homeGuideAction: "View Facilities",
    homeGuideDesc: "Check monthly 10kg rice quota, Anna Bhagya ₹170 DBT, Gruha Lakshmi ₹2,000, and locate your nearest Fair Price Shop.",
    guideModalHeading: "Ration Benefits & Shop Guide",
    guideQuotaTitle: "Monthly Ration Entitlements",
    guideFpsTitle: "Where to Get Your Ration",
    guideSchemesTitle: "Linked Government Schemes",
    closeGuideBtn: "Close Guide",
    btnReturnToMembersText: "Return to Family Members to Complete e-KYC",

    // Tabs
    tabMembersLabel: "Family e-KYC",
    tabRationFpsLabel: "Ration & Shop",
    tabSchemesLabel: "Benefits",

    // Quota & FPS
    quotaHeaderTitle: "Monthly Ration Entitlements",
    quotaSubheader: "Based on verified family strength",
    quotaRiceLabel: "Free Rice (PMGKAY)",
    quotaDbtLabel: "Anna Bhagya Cash DBT",
    quotaGrainsLabel: "Subsidized Wheat / Coarse",
    quotaSugarLabel: "Subsidized Sugar",
    fpsDetailsHeader: "Where to Get Your Ration",
    fpsDetailsSubheader: "Your Designated Fair Price Shop (FPS)",
    fpsShopLabel: "Shop Center:",
    fpsCodeLabel: "FPS Code / License:",
    fpsDistrictLabel: "Area Circle:",
    fpsTimingsLabel: "Timings:",
    fpsTimingsVal: "7:00 AM – 12:00 PM & 4:00 PM – 8:00 PM",
    fpsDatesLabel: "Schedule:",
    fpsDatesVal: "1st to 20th of every month",
    fpsAuthLabel: "Pickup Rule:",
    fpsAuthVal: "Any adult family member with linked Aadhaar can authenticate on the shop's e-PoS device.",
    btnFindFpsMapText: "Find Nearest Fair Price Shop on Map",
    onorcTitle: "One Nation One Ration Card (Portability)",
    onorcDesc: "Away from your hometown? Under ONORC, you can collect your monthly foodgrains from ANY Fair Price Shop across Karnataka and India using Aadhaar biometric authentication.",
    fpsHelplineLabel: "Civil Supplies Helpline:",

    // Schemes
    schemesHeaderTitle: "Government Welfare Facilities Linked to this Card",
    schemesHeaderDesc: "State and central welfare benefits activated by your Karnataka Ration Card",
    schemeAnnaTitle: "Anna Bhagya Scheme",
    schemeAnnaDesc: "10 kg free food grains per person per month (5 kg free rice from PMGKAY + ₹170 direct monthly cash transfer per member into Head of Family's bank account for remaining 5 kg).",
    schemeLakshmiTitle: "Gruha Lakshmi Scheme",
    schemeLakshmiDesc: "₹2,000 monthly financial aid directly transferred to the female Head of Household listed on this Ration Card.",
    schemeHealthTitle: "Arogya Karnataka Health Card",
    schemeHealthDesc: "Free tertiary & secondary hospital treatment up to ₹5,00,000 per family per year in all empanelled government and private multi-specialty hospitals using this Ration Card.",
    schemeLpgTitle: "Subsidized LPG Gas (Ujjwala / Anila Bhagya)",
    schemeLpgDesc: "Free domestic LPG cooking gas cylinder connection + subsidized refills for BPL / PHH / AAY card holders.",
    schemeSspTitle: "Student Scholarships & Hostels",
    schemeSspDesc: "Fee concessions, SSP pre-matric and post-matric scholarship grants, and free government hostel admissions for students listed on this card.",
    schemeHousingTitle: "Government Housing Assistance",
    schemeHousingDesc: "Priority eligibility for rural and urban pucca house construction subsidies under Dr. B.R. Ambedkar and Devaraj Urs housing schemes.",
    
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
    errorModalSubtitle: "Please check your ration card number and try again. If the server is busy, please try again in a moment.",
    errorRetryBtnText: "Try Again",
    errorDismissBtnText: "Cancel",
    rcErrorInvalid: "Please enter a valid Ration Card number.",
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
    rcSearchSubheading: "ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ ವಿವರಗಳನ್ನು ಪಡೆಯಿರಿ.",
    rcInputLabel: "ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ",
    scanRCText: "ಕಾರ್ಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    rcInputPlaceholder: "ಕಾರ್ಡ್ ಸಂಖ್ಯೆ",
    captchaHeaderLabel: "ಸೆಕ್ಯುರಿಟಿ ಕೋಡ್",
    refreshCaptchaText: "ಹೊಸ ಕೋಡ್",
    tapToRefreshText: "ಬದಲಿಸಿ ↻",
    captchaHelpText: "ಎಡಭಾಗದಲ್ಲಿರುವ 5 ಅಕ್ಷರಗಳನ್ನು ನಮೂದಿಸಿ",
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
    scannerModalTitle: "ಪಡಿತರ ಚೀಟಿ ಬಾರ್‌ಕೋಡ್ / QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    scannerModalDesc: "ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿರುವ ಬಾರ್‌ಕೋಡ್ ಅಥವಾ QR ಕೋಡ್ ಅನ್ನು ಚೌಕಟ್ಟಿನಲ್ಲಿ ಹಿಡಿಯಿರಿ",
    scannerStatusText: "ಕೋಡ್ ಅನ್ನು ಚೌಕಟ್ಟಿನಲ್ಲಿ ಹಿಡಿಯಿರಿ...",
    scanUploadPhotoText: "ಕಾರ್ಡ್ ಫೋಟೋ / ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",

    // Home Facilities Guide
    homeGuideTitle: "ಪಡಿತರ ಸೌಲಭ್ಯಗಳು ಮತ್ತು ನ್ಯಾಯ ಬೆಲೆ ಅಂಗಡಿ ಮಾಹಿತಿ",
    homeGuideAction: "ಸೌಲಭ್ಯಗಳನ್ನು ನೋಡಿ",
    homeGuideDesc: "ಮಾಸಿಕ 10 ಕೆಜಿ ಅಕ್ಕಿ ಕೋಟಾ, ಅನ್ನಭಾಗ್ಯ ₹170 ನಗದು ವರ್ಗಾವಣೆ, ಗೃಹಲಕ್ಷ್ಮಿ ₹2,000 ಮತ್ತು ನಿಮ್ಮ ನ್ಯಾಯ ಬೆಲೆ ಅಂಗಡಿ ಮಾಹಿತಿ ಪರಿಶೀಲಿಸಿ.",
    guideModalHeading: "ಪಡಿತರ ಸೌಲಭ್ಯಗಳು & ಅಂಗಡಿ ಮಾರ್ಗದರ್ಶಿ",
    guideQuotaTitle: "ಮಾಸಿಕ ಪಡಿತರ ಕೋಟಾ",
    guideFpsTitle: "ಪಡಿತರ ಪಡೆಯುವ ಸ್ಥಳ",
    guideSchemesTitle: "ಕಾರ್ಡ್‌ಗೆ ಲಿಂಕ್ ಆಗಿರುವ ಯೋಜನೆಗಳು",
    closeGuideBtn: "ಮಾರ್ಗದರ್ಶಿ ಮುಚ್ಚಿ",
    btnReturnToMembersText: "ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳಿಸಲು ಕುಟುಂಬದ ಸದಸ್ಯರ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ",

    // Tabs
    tabMembersLabel: "ಕುಟುಂಬದ ಇ-ಕೆವೈಸಿ",
    tabRationFpsLabel: "ಪಡಿತರ & ಅಂಗಡಿ",
    tabSchemesLabel: "ಸೌಲಭ್ಯಗಳು",

    // Quota & FPS
    quotaHeaderTitle: "ಮಾಸಿಕ ಪಡಿತರ ಕೋಟಾ ವಿವರ",
    quotaSubheader: "ಕುಟುಂಬದ ಸದಸ್ಯರ ಸಂಖ್ಯೆಯ ಆಧಾರದ ಮೇಲೆ",
    quotaRiceLabel: "ಉಚಿತ ಅಕ್ಕಿ (PMGKAY)",
    quotaDbtLabel: "ಅನ್ನಭಾಗ್ಯ ನಗದು ವರ್ಗಾವಣೆ (DBT)",
    quotaGrainsLabel: "ರಿಯಾಯಿತಿ ಗೋಧಿ / ಸಿರಿಧಾನ್ಯ",
    quotaSugarLabel: "ರಿಯಾಯಿತಿ ಸಕ್ಕರೆ",
    fpsDetailsHeader: "ಪಡಿತರ ಎಲ್ಲಿ ಪಡೆಯಬೇಕು?",
    fpsDetailsSubheader: "ನಿಮ್ಮ ಅಧಿಕೃತ ನ್ಯಾಯ ಬೆಲೆ ಅಂಗಡಿ (FPS)",
    fpsShopLabel: "ನ್ಯಾಯ ಬೆಲೆ ಅಂಗಡಿ:",
    fpsCodeLabel: "ಅಂಗಡಿ ಕೋಡ್ / ಪರವಾನಗಿ:",
    fpsDistrictLabel: "ವ್ಯಾಪ್ತಿ ವೃತ್ತ:",
    fpsTimingsLabel: "ಸಮಯ:",
    fpsTimingsVal: "ಬೆಳಿಗ್ಗೆ 7:00 – 12:00 & ಸಂಜೆ 4:00 – 8:00",
    fpsDatesLabel: "ದಿನಾಂಕಗಳು:",
    fpsDatesVal: "ಪ್ರತಿ ತಿಂಗಳ 1 ರಿಂದ 20 ನೇ ತಾರೀಖು",
    fpsAuthLabel: "ಪಡೆಯುವ ನಿಯಮ:",
    fpsAuthVal: "ಕಾರ್ಡ್‌ನಲ್ಲಿ ಹೆಸರಿರುವ ಯಾವುದೇ ವಯಸ್ಕ ಸದಸ್ಯರು ನ್ಯಾಯ ಬೆಲೆ ಅಂಗಡಿಯ e-PoS ಯಂತ್ರದಲ್ಲಿ ಬೆರಳಚ್ಚು ನೀಡಿ ಪಡಿತರ ಪಡೆಯಬಹುದು.",
    btnFindFpsMapText: "ಹತ್ತಿರದ ನ್ಯಾಯ ಬೆಲೆ ಅಂಗಡಿ ಹುಡುಕಿ (ಮ್ಯಾಪ್)",
    onorcTitle: "ಒಂದು ದೇಶ ಒಂದು ಪಡಿತರ ಚೀಟಿ (ಪೋರ್ಟೆಬಿಲಿಟಿ)",
    onorcDesc: "ನಿಮ್ಮ ಊರಿನಿಂದ ದೂರವಿದ್ದೀರಾ? ONORC ಅಡಿಯಲ್ಲಿ, ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ದೃಢೀಕರಣದೊಂದಿಗೆ ನೀವು ಕರ್ನಾಟಕ ಹಾಗೂ ಭಾರತದ ಯಾವುದೇ ನ್ಯಾಯ ಬೆಲೆ ಅಂಗಡಿಯಿಂದ ನಿಮ್ಮ ಮಾಸಿಕ ಪಡಿತರವನ್ನು ಪಡೆಯಬಹುದು.",
    fpsHelplineLabel: "ಆಹಾರ ಇಲಾಖೆ ಸಹಾಯವಾಣಿ:",

    // Schemes
    schemesHeaderTitle: "ಈ ಪಡಿತರ ಚೀಟಿಗೆ ಲಿಂಕ್ ಆಗಿರುವ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳು",
    schemesHeaderDesc: "ಕರ್ನಾಟಕ ಪಡಿತರ ಚೀಟಿದಾರರಿಗೆ ಸಿಗುವ ಎಲ್ಲಾ ರಾಜ್ಯ ಮತ್ತು ಕೇಂದ್ರ ಸರ್ಕಾರದ ಯೋಜನೆಗಳು",
    schemeAnnaTitle: "ಅನ್ನಭಾಗ್ಯ ಯೋಜನೆ",
    schemeAnnaDesc: "ಪ್ರತಿ ಸದಸ್ಯರಿಗೆ ತಿಂಗಳಿಗೆ 10 ಕೆಜಿ ಉಚಿತ ಆಹಾರ ಧಾನ್ಯ (5 ಕೆಜಿ ಉಚಿತ ಅಕ್ಕಿ + ಉಳಿದ 5 ಕೆಜಿಗೆ ಪ್ರತಿ ಸದಸ್ಯರಿಗೆ ₹170 ರಂತೆ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರ ನಗದು ವರ್ಗಾವಣೆ).",
    schemeLakshmiTitle: "ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆ",
    schemeLakshmiDesc: "ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿ ನಮೂದಿಸಲಾದ ಕುಟುಂಬದ ಯಜಮಾನಿ (ಮಹಿಳೆ) ಖಾತೆಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹2,000 ನೇರ ಆರ್ಥಿಕ ನೆರವು.",
    schemeHealthTitle: "ಆರೋಗ್ಯ ಕರ್ನಾಟಕ - ಆಯುಷ್ಮಾನ್ ಭಾರತ್",
    schemeHealthDesc: "ಈ ಪಡಿತರ ಚೀಟಿ ಮೂಲಕ ಸರ್ಕಾರಿ ಮತ್ತು ನೋಂದಾಯಿತ ಖಾಸಗಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ₹5,00,000 ವರೆಗೆ ಉಚಿತ ನಗದುರಹಿತ ಚಿಕಿತ್ಸೆ.",
    schemeLpgTitle: "ರಿಯಾಯಿತಿ ದರದ ಎಲ್‌ಪಿಜಿ ಗ್ಯಾಸ್ (ಅನಿಲ ಭಾಗ್ಯ / ಉಜ್ವಲ)",
    schemeLpgDesc: "ಬಿಪಿಎಲ್/ಅಂತ್ಯೋದಯ ಪಡಿತರ ಚೀಟಿದಾರರಿಗೆ ಉಚಿತ ಗ್ಯಾಸ್ ಸಂಪರ್ಕ ಮತ್ತು ಸಬ್ಸಿಡಿ ಸಿಲಿಂಡರ್ ಮರುಪೂರಣ.",
    schemeSspTitle: "ವಿದ್ಯಾರ್ಥಿವೇತನ & ಉಚಿತ ಹಾಸ್ಟೆಲ್ ಸೌಲಭ್ಯ",
    schemeSspDesc: "ಕಾರ್ಡ್‌ನಲ್ಲಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಪೋಸ್ಟ್-ಮೆಟ್ರಿಕ್/ಮೆಟ್ರಿಕ್-ಪೂರ್ವ ವಿದ್ಯಾರ್ಥಿವೇತನ (SSP ಪೋರ್ಟಲ್), ಶೈಕ್ಷಣಿಕ ಶುಲ್ಕ ವಿನಾಯಿತಿ ಮತ್ತು ಸರ್ಕಾರಿ ಹಾಸ್ಟೆಲ್ ಪ್ರವೇಶ.",
    schemeHousingTitle: "ಸರ್ಕಾರಿ ವಸತಿ ಯೋಜನೆಗಳ ಸೌಲಭ್ಯ",
    schemeHousingDesc: "ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಹಾಗೂ ದೇವರಾಜ ಅರಸು ವಸತಿ ಯೋಜನೆಗಳ ಅಡಿಯಲ್ಲಿ ಪಕ್ಕಾ ಮನೆ ನಿರ್ಮಾಣಕ್ಕೆ ಆದ್ಯತೆ ಮತ್ತು ಸಹಾಯಧನ.",
    
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
    errorModalSubtitle: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ. ಸರ್ವರ್ ಕಾರ್ಯನಿರತವಾಗಿದ್ದರೆ ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.",
    errorRetryBtnText: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    errorDismissBtnText: "ರದ್ದುಮಾಡಿ",
    rcErrorInvalid: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
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
const rosterListContainer = document.getElementById("rosterListContainer");


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
        window.open("https://github.com/mrnaddu/Kyc/releases/latest", "_blank", "noopener");
      }
    });
  }

  const bannerUpdateBtn = document.getElementById("btnBannerUpdate");
  if (bannerUpdateBtn) {
    bannerUpdateBtn.addEventListener("click", () => {
      if (window.AndroidKyc && typeof window.AndroidKyc.checkForUpdates === "function") {
        window.AndroidKyc.checkForUpdates();
      } else {
        window.open("https://github.com/mrnaddu/Kyc/releases/latest", "_blank", "noopener");
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
  // Real-time counter & auto-format for Ration Card (alphanumeric)
  rcInput.addEventListener("input", async (e) => {
    // Permit alphanumeric characters and convert to uppercase
    const clean = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    e.target.value = clean;

    clearRcError();

    // Update real-time counter
    if (clean.length >= 5) {
      rcDigitCounter.className = "text-[10px] font-mono text-emerald-600 font-bold";
      rcDigitCounter.textContent = `${clean.length} chars ✓`;
    } else if (clean.length > 0) {
      rcDigitCounter.className = "text-[10px] font-mono text-slate-400";
      rcDigitCounter.textContent = `${clean.length} chars`;
    } else {
      rcDigitCounter.className = "text-[10px] font-mono text-slate-400";
      rcDigitCounter.textContent = "";
    }
  });

  // Auto-uppercase captcha input with live feedback & auto-dismiss keyboard on 5 characters
  captchaInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
    clearCaptchaError();
    updateCaptchaFeedback();
    if (e.target.value.length === 5) {
      dismissKeyboard();
    }
  });

  // Enter key handling on Ration Card input
  rcInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (captchaInput) {
        captchaInput.focus();
      } else {
        dismissKeyboard();
      }
    }
  });

  // Enter key handling on Captcha input
  captchaInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      dismissKeyboard();
      handleFetchRationCard();
    }
  });

  // Tap outside inputs to dismiss keyboard
  const handleOutsideTap = (e) => {
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
      if (!e.target.closest("input, textarea, button, [role='button'], a, label, #captchaBoxWrapper")) {
        dismissKeyboard();
      }
    }
  };
  document.addEventListener("touchstart", handleOutsideTap, { passive: true });
  document.addEventListener("mousedown", handleOutsideTap);
}

// Dismiss soft keyboard across mobile browsers and native Android WebView
function dismissKeyboard() {
  if (document.activeElement && typeof document.activeElement.blur === "function") {
    document.activeElement.blur();
  }
  if (window.AndroidKyc && typeof window.AndroidKyc.hideKeyboard === "function") {
    try {
      window.AndroidKyc.hideKeyboard();
    } catch (_) {}
  }
}

function updateCaptchaFeedback() {
  const charCount = document.getElementById("captchaCharCount");
  const indicator = document.getElementById("captchaStatusIndicator");
  const len = captchaInput ? captchaInput.value.length : 0;
  if (charCount) {
    charCount.textContent = `${len}/5`;
    charCount.className = len === 5 ? "font-mono font-bold text-emerald-600" : "font-mono font-bold text-slate-400";
  }
  if (indicator) {
    if (len === 5) {
      indicator.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i>';
    } else {
      indicator.innerHTML = '<i class="fa-solid fa-lock text-slate-300 text-xs"></i>';
    }
  }
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
  if (topNavHomeLabel) topNavHomeLabel.textContent = t.topNavHome;

  // RC Search View
  const deptBadge = document.getElementById("deptBadgeText");
  if (deptBadge) deptBadge.textContent = t.deptBadgeText;
  document.getElementById("rcSearchHeading").textContent = t.rcSearchHeading;
  document.getElementById("rcSearchSubheading").textContent = t.rcSearchSubheading;
  document.getElementById("rcInputLabel").innerHTML = `${t.rcInputLabel} <span class="text-rose-500">*</span>`;
  const scanRCText = document.getElementById("scanRCText");
  if (scanRCText) scanRCText.textContent = t.scanRCText;
  rcInput.placeholder = t.rcInputPlaceholder;
  const captchaHeaderLabel = document.getElementById("captchaHeaderLabel");
  if (captchaHeaderLabel) captchaHeaderLabel.innerHTML = `<i class="fa-solid fa-shield-halved text-emerald-600 text-xs"></i> <span>${t.captchaHeaderLabel}</span>`;
  const refreshCaptchaText = document.getElementById("refreshCaptchaText");
  if (refreshCaptchaText) refreshCaptchaText.textContent = t.refreshCaptchaText;
  const tapToRefreshText = document.getElementById("tapToRefreshText");
  if (tapToRefreshText) tapToRefreshText.textContent = t.tapToRefreshText || "tap ↻";
  const captchaHelpText = document.getElementById("captchaHelpText");
  if (captchaHelpText) captchaHelpText.innerHTML = `<i class="fa-solid fa-circle-info text-[9px] text-slate-400"></i> <span>${t.captchaHelpText}</span>`;
  document.getElementById("consentTextLabel").innerHTML = t.consentTextLabel;
  document.getElementById("fetchBtnText").textContent = t.fetchBtnText;

  // Home Facilities Guide
  const homeGuideTitle = document.getElementById("homeGuideTitle");
  if (homeGuideTitle) homeGuideTitle.innerHTML = `<i class="fa-solid fa-wheat-awn text-amber-600"></i> <span>${t.homeGuideTitle}</span>`;
  const homeGuideAction = document.getElementById("homeGuideAction");
  if (homeGuideAction) homeGuideAction.textContent = t.homeGuideAction;
  const homeGuideDesc = document.getElementById("homeGuideDesc");
  if (homeGuideDesc) homeGuideDesc.textContent = t.homeGuideDesc;

  // Facilities Guide Modal
  const guideModalHeading = document.getElementById("guideModalHeading");
  if (guideModalHeading) guideModalHeading.textContent = t.guideModalHeading;
  const guideQuotaTitle = document.getElementById("guideQuotaTitle");
  if (guideQuotaTitle) guideQuotaTitle.textContent = t.guideQuotaTitle;
  const guideFpsTitle = document.getElementById("guideFpsTitle");
  if (guideFpsTitle) guideFpsTitle.textContent = t.guideFpsTitle;
  const guideSchemesTitle = document.getElementById("guideSchemesTitle");
  if (guideSchemesTitle) guideSchemesTitle.textContent = t.guideSchemesTitle;
  const btnDismissFacilitiesGuide = document.getElementById("btnDismissFacilitiesGuide");
  if (btnDismissFacilitiesGuide) btnDismissFacilitiesGuide.textContent = t.closeGuideBtn;

  // Tabs & Return Buttons
  const tabMembersLabel = document.getElementById("tabMembersLabel");
  if (tabMembersLabel) tabMembersLabel.textContent = t.tabMembersLabel;
  const tabRationFpsLabel = document.getElementById("tabRationFpsLabel");
  if (tabRationFpsLabel) tabRationFpsLabel.textContent = t.tabRationFpsLabel;
  const tabSchemesLabel = document.getElementById("tabSchemesLabel");
  if (tabSchemesLabel) tabSchemesLabel.textContent = t.tabSchemesLabel;
  const btnFpsBackToMembersText = document.getElementById("btnFpsBackToMembersText");
  if (btnFpsBackToMembersText) btnFpsBackToMembersText.textContent = t.btnReturnToMembersText;
  const btnSchemesBackToMembersText = document.getElementById("btnSchemesBackToMembersText");
  if (btnSchemesBackToMembersText) btnSchemesBackToMembersText.textContent = t.btnReturnToMembersText;

  // Quota & FPS
  const quotaHeaderTitle = document.getElementById("quotaHeaderTitle");
  if (quotaHeaderTitle) quotaHeaderTitle.textContent = t.quotaHeaderTitle;
  const quotaSubheader = document.getElementById("quotaSubheader");
  if (quotaSubheader) quotaSubheader.textContent = t.quotaSubheader;
  const quotaRiceLabel = document.getElementById("quotaRiceLabel");
  if (quotaRiceLabel) quotaRiceLabel.textContent = t.quotaRiceLabel;
  const quotaDbtLabel = document.getElementById("quotaDbtLabel");
  if (quotaDbtLabel) quotaDbtLabel.textContent = t.quotaDbtLabel;
  const quotaGrainsLabel = document.getElementById("quotaGrainsLabel");
  if (quotaGrainsLabel) quotaGrainsLabel.textContent = t.quotaGrainsLabel;
  const quotaSugarLabel = document.getElementById("quotaSugarLabel");
  if (quotaSugarLabel) quotaSugarLabel.textContent = t.quotaSugarLabel;

  const fpsDetailsHeader = document.getElementById("fpsDetailsHeader");
  if (fpsDetailsHeader) fpsDetailsHeader.textContent = t.fpsDetailsHeader;
  const fpsDetailsSubheader = document.getElementById("fpsDetailsSubheader");
  if (fpsDetailsSubheader) fpsDetailsSubheader.textContent = t.fpsDetailsSubheader;
  const fpsShopLabel = document.getElementById("fpsShopLabel");
  if (fpsShopLabel) fpsShopLabel.textContent = t.fpsShopLabel;
  const fpsCodeLabel = document.getElementById("fpsCodeLabel");
  if (fpsCodeLabel) fpsCodeLabel.textContent = t.fpsCodeLabel;
  const fpsDistrictLabel = document.getElementById("fpsDistrictLabel");
  if (fpsDistrictLabel) fpsDistrictLabel.textContent = t.fpsDistrictLabel;
  const fpsTimingsLabel = document.getElementById("fpsTimingsLabel");
  if (fpsTimingsLabel) fpsTimingsLabel.textContent = t.fpsTimingsLabel;
  const fpsTimingsVal = document.getElementById("fpsTimingsVal");
  if (fpsTimingsVal) fpsTimingsVal.textContent = t.fpsTimingsVal;
  const fpsDatesLabel = document.getElementById("fpsDatesLabel");
  if (fpsDatesLabel) fpsDatesLabel.textContent = t.fpsDatesLabel;
  const fpsDatesVal = document.getElementById("fpsDatesVal");
  if (fpsDatesVal) fpsDatesVal.textContent = t.fpsDatesVal;
  const fpsAuthLabel = document.getElementById("fpsAuthLabel");
  if (fpsAuthLabel) fpsAuthLabel.textContent = t.fpsAuthLabel;
  const fpsAuthVal = document.getElementById("fpsAuthVal");
  if (fpsAuthVal) fpsAuthVal.textContent = t.fpsAuthVal;
  const btnFindFpsMapText = document.getElementById("btnFindFpsMapText");
  if (btnFindFpsMapText) btnFindFpsMapText.textContent = t.btnFindFpsMapText;
  const onorcTitle = document.getElementById("onorcTitle");
  if (onorcTitle) onorcTitle.innerHTML = `<i class="fa-solid fa-arrows-split-up-and-left text-blue-600"></i> <span>${t.onorcTitle}</span>`;
  const onorcDesc = document.getElementById("onorcDesc");
  if (onorcDesc) onorcDesc.innerHTML = t.onorcDesc;
  const fpsHelplineLabel = document.getElementById("fpsHelplineLabel");
  if (fpsHelplineLabel) fpsHelplineLabel.textContent = t.fpsHelplineLabel;

  // Schemes
  const schemesHeaderTitle = document.getElementById("schemesHeaderTitle");
  if (schemesHeaderTitle) schemesHeaderTitle.textContent = t.schemesHeaderTitle;
  const schemesHeaderDesc = document.getElementById("schemesHeaderDesc");
  if (schemesHeaderDesc) schemesHeaderDesc.textContent = t.schemesHeaderDesc;
  const schemeAnnaTitle = document.getElementById("schemeAnnaTitle");
  if (schemeAnnaTitle) schemeAnnaTitle.textContent = t.schemeAnnaTitle;
  const schemeAnnaDesc = document.getElementById("schemeAnnaDesc");
  if (schemeAnnaDesc) schemeAnnaDesc.textContent = t.schemeAnnaDesc;
  const schemeLakshmiTitle = document.getElementById("schemeLakshmiTitle");
  if (schemeLakshmiTitle) schemeLakshmiTitle.textContent = t.schemeLakshmiTitle;
  const schemeLakshmiDesc = document.getElementById("schemeLakshmiDesc");
  if (schemeLakshmiDesc) schemeLakshmiDesc.textContent = t.schemeLakshmiDesc;
  const schemeHealthTitle = document.getElementById("schemeHealthTitle");
  if (schemeHealthTitle) schemeHealthTitle.textContent = t.schemeHealthTitle;
  const schemeHealthDesc = document.getElementById("schemeHealthDesc");
  if (schemeHealthDesc) schemeHealthDesc.textContent = t.schemeHealthDesc;
  const schemeLpgTitle = document.getElementById("schemeLpgTitle");
  if (schemeLpgTitle) schemeLpgTitle.textContent = t.schemeLpgTitle;
  const schemeLpgDesc = document.getElementById("schemeLpgDesc");
  if (schemeLpgDesc) schemeLpgDesc.textContent = t.schemeLpgDesc;
  const schemeSspTitle = document.getElementById("schemeSspTitle");
  if (schemeSspTitle) schemeSspTitle.textContent = t.schemeSspTitle;
  const schemeSspDesc = document.getElementById("schemeSspDesc");
  if (schemeSspDesc) schemeSspDesc.textContent = t.schemeSspDesc;
  const schemeHousingTitle = document.getElementById("schemeHousingTitle");
  if (schemeHousingTitle) schemeHousingTitle.textContent = t.schemeHousingTitle;
  const schemeHousingDesc = document.getElementById("schemeHousingDesc");
  if (schemeHousingDesc) schemeHousingDesc.textContent = t.schemeHousingDesc;

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
  const scannerModalDesc = document.getElementById("scannerModalDesc");
  if (scannerModalDesc) scannerModalDesc.textContent = t.scannerModalDesc;
  const scannerStatusText = document.getElementById("scannerStatusText");
  if (scannerStatusText) scannerStatusText.textContent = t.scannerStatusText;
  const scanUploadPhotoText = document.getElementById("scanUploadPhotoText");
  if (scanUploadPhotoText) scanUploadPhotoText.textContent = t.scanUploadPhotoText;

  // Re-render roster if already loaded
  if (appState.cardData) {
    renderFamilyRoster(appState.cardData);
  }

  // Update current step label
  stepLabelText.textContent = t.steps[appState.step] || t.steps[0];
}

// Real Barcode & QR Code Scanner State & Engine
let html5QrScannerInstance = null;

function playScanBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
}

function extractRationCardNumber(rawText) {
  if (!rawText) return null;
  const str = String(rawText).trim();

  // 1. URL parsing (query params like rc, rcNumber, cardNo, or last path segment)
  try {
    if (str.startsWith("http://") || str.startsWith("https://")) {
      const parsedUrl = new URL(str);
      const params = ["rc", "rcno", "rc_no", "rcnumber", "rc_number", "cardno", "card_no", "rationcard"];
      for (const p of params) {
        const val = parsedUrl.searchParams.get(p);
        if (val && /^[A-Za-z0-9]{5,25}$/.test(val.trim())) {
          return val.trim().toUpperCase();
        }
      }
      const segments = parsedUrl.pathname.split("/").filter(Boolean);
      for (let i = segments.length - 1; i >= 0; i--) {
        if (/^[A-Za-z0-9]{5,25}$/.test(segments[i])) {
          return segments[i].toUpperCase();
        }
      }
    }
  } catch (e) {}

  // 2. XML / JSON / Key-Value attributes (e.g. rc="260300261661" or rc_no: "...")
  const attrMatch = str.match(/(?:rc|rc_?no|rc_?number|card_?no|ration_?card)["':=\s]+([A-Za-z0-9]{5,25})/i);
  if (attrMatch && attrMatch[1]) {
    return attrMatch[1].toUpperCase();
  }

  // 3. Labeled Prefix: "RC: 260300261661" or "RATION CARD: ..."
  const prefixMatch = str.match(/(?:RC|RATION\s*CARD(?:\s*NO)?)\s*[:#-]?\s*([A-Za-z0-9]{5,25})/i);
  if (prefixMatch && prefixMatch[1]) {
    return prefixMatch[1].toUpperCase();
  }

  // 4. Exact 12-digit number sequence in string
  const twelveDigits = str.match(/\b\d{12}\b/);
  if (twelveDigits) {
    return twelveDigits[0];
  }

  // 5. Clean string of spaces/punctuation; if 5-25 alphanumeric chars, return it
  const clean = str.replace(/[^A-Za-z0-9]/g, "");
  if (clean.length >= 5 && clean.length <= 25) {
    return clean.toUpperCase();
  }

  return null;
}

function handleSuccessfulScan(decodedText) {
  const extractedRc = extractRationCardNumber(decodedText);
  if (!extractedRc) {
    showToast(
      appState.currentLang === "KN" ? "ಅಮಾನ್ಯ ಕೋಡ್ ಪತ್ತೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ." : "No valid Ration Card found in scanned code.",
      "error"
    );
    return;
  }

  playScanBeep();
  if (navigator.vibrate) navigator.vibrate([70, 40, 70]);

  closeDocumentScanner();

  rcInput.value = extractedRc;
  rcDigitCounter.className = "text-[10px] font-mono text-emerald-600 font-bold";
  rcDigitCounter.textContent = `${extractedRc.length} chars ✓`;
  clearRcError();

  showToast(
    appState.currentLang === "KN" ? `ಪಡಿತರ ಚೀಟಿ ಯಶಸ್ವಿಯಾಗಿ ಸ್ಕ್ಯಾನ್ ಆಗಿದೆ: ${extractedRc}` : `Ration Card scanned: ${extractedRc}`,
    "success"
  );
  captchaInput.focus();
}

async function openDocumentScanner(mode) {
  const t = translations[appState.currentLang];
  scannerModalTitle.textContent = t.scannerModalTitle || "Scan Ration Card Barcode / QR";
  const descEl = document.getElementById("scannerModalDesc");
  if (descEl) descEl.textContent = t.scannerModalDesc || "Align the barcode or QR code on your ration card";
  const statusEl = document.getElementById("scannerStatusText");
  if (statusEl) statusEl.textContent = appState.currentLang === "KN" ? "ಕ್ಯಾಮೆರಾ ಆರಂಭಿಸಲಾಗುತ್ತಿದೆ..." : "Starting camera...";
  scannerModal.classList.remove("hidden");

  try {
    if (typeof Html5Qrcode !== "undefined") {
      if (!html5QrScannerInstance) {
        html5QrScannerInstance = new Html5Qrcode("scannerReader", {
          verbose: false,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.DATA_MATRIX
          ]
        });
      }

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 160 },
        aspectRatio: 1.4
      };

      await html5QrScannerInstance.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          handleSuccessfulScan(decodedText);
        },
        (errorMessage) => {
          // Normal frame scan tick
        }
      );
      if (statusEl) statusEl.textContent = appState.currentLang === "KN" ? "ಬಾರ್‌ಕೋಡ್ ಅಥವಾ QR ಕೋಡ್ ಅನ್ನು ಚೌಕಟ್ಟಿನಲ್ಲಿ ಹಿಡಿಯಿರಿ..." : "Align barcode or QR code within the frame...";
    } else {
      if (statusEl) statusEl.textContent = "Scanner engine loading...";
    }
  } catch (err) {
    console.warn("Camera start error:", err);
    if (statusEl) statusEl.textContent = appState.currentLang === "KN" ? "ಕ್ಯಾಮೆರಾ ದೋಷ: ದಯವಿಟ್ಟು ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ನೀಡಿ" : "Camera access required. Please check permissions.";
  }
}

async function closeDocumentScanner() {
  scannerModal.classList.add("hidden");
  if (html5QrScannerInstance) {
    try {
      if (html5QrScannerInstance.isScanning) {
        await html5QrScannerInstance.stop();
      }
    } catch (e) {
      console.warn("Error stopping scanner:", e);
    }
  }
}

async function handleScannerImageUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const statusEl = document.getElementById("scannerStatusText");
  if (statusEl) statusEl.textContent = appState.currentLang === "KN" ? "ಫೋಟೋ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ..." : "Analyzing photo for barcode / QR...";

  try {
    if (!html5QrScannerInstance && typeof Html5Qrcode !== "undefined") {
      html5QrScannerInstance = new Html5Qrcode("scannerReader", { verbose: false });
    }
    if (html5QrScannerInstance) {
      if (html5QrScannerInstance.isScanning) {
        await html5QrScannerInstance.stop();
      }
      const decodedText = await html5QrScannerInstance.scanFile(file, true);
      handleSuccessfulScan(decodedText);
    }
  } catch (err) {
    console.warn("Image decode error:", err);
    showToast(
      appState.currentLang === "KN" ? "ಫೋಟೋದಲ್ಲಿ ಯಾವುದೇ ಬಾರ್‌ಕೋಡ್ ಅಥವಾ QR ಕೋಡ್ ಕಂಡುಬಂದಿಲ್ಲ." : "No clear barcode or QR code found in this photo.",
      "error"
    );
    if (statusEl) statusEl.textContent = appState.currentLang === "KN" ? "ಕೋಡ್ ಕಂಡುಬಂದಿಲ್ಲ. ಮತ್ತೊಂದು ಫೋಟೋ ಪ್ರಯತ್ನಿಸಿ." : "No code detected. Try a clearer photo.";
  } finally {
    e.target.value = "";
  }
}

// Roster Tabs Switching Controller
function switchRosterTab(tabName) {
  const btnMembers = document.getElementById("tabBtnMembers");
  const btnRationFps = document.getElementById("tabBtnRationFps");
  const btnSchemes = document.getElementById("tabBtnSchemes");

  const panelMembers = document.getElementById("panelMembers");
  const panelRationFps = document.getElementById("panelRationFps");
  const panelSchemes = document.getElementById("panelSchemes");

  if (!btnMembers || !panelMembers) return;

  // Reset all buttons to inactive
  [btnMembers, btnRationFps, btnSchemes].forEach(b => {
    if (b) b.className = "flex-1 py-2 px-1 rounded-lg text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 sm:gap-1.5 transition text-center leading-tight";
  });
  panelMembers.classList.add("hidden");
  if (panelRationFps) panelRationFps.classList.add("hidden");
  if (panelSchemes) panelSchemes.classList.add("hidden");

  if (tabName === "rationFps") {
    if (btnRationFps) btnRationFps.className = "flex-1 py-2 px-1 rounded-lg tab-btn-active text-slate-900 shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 transition text-center leading-tight";
    if (panelRationFps) panelRationFps.classList.remove("hidden");
  } else if (tabName === "schemes") {
    if (btnSchemes) btnSchemes.className = "flex-1 py-2 px-1 rounded-lg tab-btn-active text-slate-900 shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 transition text-center leading-tight";
    if (panelSchemes) panelSchemes.classList.remove("hidden");
  } else {
    btnMembers.className = "flex-1 py-2 px-1 rounded-lg tab-btn-active text-slate-900 shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 transition text-center leading-tight";
    panelMembers.classList.remove("hidden");
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
  if (btnScanRC) btnScanRC.addEventListener("click", () => openDocumentScanner("rc"));
  if (btnCloseScanner) btnCloseScanner.addEventListener("click", closeDocumentScanner);

  const scannerFileInput = document.getElementById("scannerFileInput");
  if (scannerFileInput) scannerFileInput.addEventListener("change", handleScannerImageUpload);

  // Home Facilities Guide Modal Actions & Touch Accessibility
  const cardFacilitiesGuide = document.getElementById("cardFacilitiesGuide");
  const btnOpenFacilitiesGuide = document.getElementById("btnOpenFacilitiesGuide");
  const btnCloseFacilitiesGuide = document.getElementById("btnCloseFacilitiesGuide");
  const btnDismissFacilitiesGuide = document.getElementById("btnDismissFacilitiesGuide");
  const facilitiesGuideModal = document.getElementById("facilitiesGuideModal");

  const openFacilitiesGuideModal = () => {
    if (facilitiesGuideModal) {
      facilitiesGuideModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  };

  const closeFacilitiesGuideModal = () => {
    if (facilitiesGuideModal) {
      facilitiesGuideModal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  };

  if (cardFacilitiesGuide) {
    cardFacilitiesGuide.addEventListener("click", openFacilitiesGuideModal);
    cardFacilitiesGuide.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFacilitiesGuideModal();
      }
    });
  }
  if (btnOpenFacilitiesGuide) {
    btnOpenFacilitiesGuide.addEventListener("click", (e) => {
      e.stopPropagation();
      openFacilitiesGuideModal();
    });
  }
  if (btnCloseFacilitiesGuide) btnCloseFacilitiesGuide.addEventListener("click", closeFacilitiesGuideModal);
  if (btnDismissFacilitiesGuide) btnDismissFacilitiesGuide.addEventListener("click", closeFacilitiesGuideModal);
  if (facilitiesGuideModal) {
    facilitiesGuideModal.addEventListener("click", (e) => {
      if (e.target === facilitiesGuideModal) closeFacilitiesGuideModal();
    });
  }

  // Global Escape key listener
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFacilitiesGuideModal();
      closeDocumentScanner();
      hideErrorModal();
    }
  });

  // Roster Tab Switchers & Return Buttons
  const tabBtnMembers = document.getElementById("tabBtnMembers");
  const tabBtnRationFps = document.getElementById("tabBtnRationFps");
  const tabBtnSchemes = document.getElementById("tabBtnSchemes");
  const btnFpsReturnToMembers = document.getElementById("btnFpsReturnToMembers");
  const btnSchemesReturnToMembers = document.getElementById("btnSchemesReturnToMembers");

  if (tabBtnMembers) tabBtnMembers.addEventListener("click", () => switchRosterTab("members"));
  if (tabBtnRationFps) tabBtnRationFps.addEventListener("click", () => switchRosterTab("rationFps"));
  if (tabBtnSchemes) tabBtnSchemes.addEventListener("click", () => switchRosterTab("schemes"));
  if (btnFpsReturnToMembers) btnFpsReturnToMembers.addEventListener("click", () => switchRosterTab("members"));
  if (btnSchemesReturnToMembers) btnSchemesReturnToMembers.addEventListener("click", () => switchRosterTab("members"));

  // RC Search & Captcha Refresh
  if (btnRefreshCaptcha) {
    btnRefreshCaptcha.addEventListener("click", () => {
      dismissKeyboard();
      loadCaptcha();
    });
  }
  const captchaBoxWrapper = document.getElementById("captchaBoxWrapper");
  if (captchaBoxWrapper) {
    captchaBoxWrapper.addEventListener("click", () => {
      dismissKeyboard();
      loadCaptcha();
    });
    captchaBoxWrapper.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dismissKeyboard();
        loadCaptcha();
      }
    });
  }
  btnFetchRationCard.addEventListener("click", () => {
    dismissKeyboard();
    handleFetchRationCard();
  });

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
      updateCaptchaFeedback();
    }
  } catch (err) {
    captchaBox.innerHTML = `<span class="text-xs text-rose-500 font-semibold">Offline</span>`;
  } finally {
    if (icon) setTimeout(() => icon.classList.remove("animate-spin"), 400);
  }
}

// Fetch Ration Card with Multi-Stage Loading & Friendly Error Handling
async function handleFetchRationCard() {
  dismissKeyboard();
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

  // 1. Validate Alphanumeric Ration Card ID (5 to 25 chars)
  if (!rcNumber || rcNumber.length < 5 || rcNumber.length > 25 || !/^[A-Z0-9]+$/i.test(rcNumber)) {
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
      try {
        hideLoadingScreen();
        appState.cardData = result.data;
        renderFamilyRoster(result.data);
        setStep(1);
      } catch (renderErr) {
        console.error("Error setting up family roster:", renderErr);
        hideLoadingScreen();
        setStep(1);
        showToast(appState.currentLang === "KN" ? "ವಿವರಗಳನ್ನು ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ" : "Error displaying roster: " + renderErr.message, "error");
      }
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
  if (!data) return;

  const container = document.getElementById("rosterListContainer") || rosterListContainer;
  if (!container) {
    console.error("rosterListContainer element not found");
    return;
  }

  const isKn = appState.currentLang === "KN";

  const pvcRc = document.getElementById("pvcRcNumber");
  if (pvcRc) pvcRc.textContent = data.rcNumber || "";

  const hofName = isKn 
    ? (data.headOfFamily?.nameKn || data.headOfFamily?.nameEn || data.members?.[0]?.nameEn || "Hazira") 
    : (data.headOfFamily?.nameEn || data.members?.[0]?.nameEn || "Hazira");
  const pvcHof = document.getElementById("pvcHofName");
  if (pvcHof) pvcHof.textContent = hofName;

  const schemeEl = document.getElementById("pvcSchemeValue");
  if (schemeEl) schemeEl.textContent = data.cardType || data.cardTypeLabel || "PHH / BPL Category";

  const members = Array.isArray(data.members) ? data.members : [];
  const memberCount = members.length;
  const countEl = document.getElementById("memberCountText");
  if (countEl) countEl.textContent = isKn ? `${memberCount} ಸದಸ್ಯರು` : `${memberCount} Members`;

  // Dynamic Quota & Entitlement Calculations
  const quotaMembersBadge = document.getElementById("quotaMembersCount");
  if (quotaMembersBadge) quotaMembersBadge.textContent = memberCount;
  
  const riceKg = memberCount * 5;
  const dbtCash = memberCount * 170;
  const quotaRiceVal = document.getElementById("quotaRiceVal");
  if (quotaRiceVal) quotaRiceVal.textContent = `${riceKg} kg`;
  const quotaDbtVal = document.getElementById("quotaDbtVal");
  if (quotaDbtVal) quotaDbtVal.textContent = `₹${dbtCash}`;

  // Populate Fair Price Shop Information
  const fpsShopName = document.getElementById("fpsShopName");
  if (fpsShopName) fpsShopName.textContent = data.location?.fpsDealerName || "Government Fair Price Shop #148";
  const fpsShopCode = document.getElementById("fpsShopCode");
  if (fpsShopCode) fpsShopCode.textContent = data.location?.fpsCode || "KA-PDS-ONLINE";
  const fpsDistrictName = document.getElementById("fpsDistrictName");
  if (fpsDistrictName) fpsDistrictName.textContent = `${data.location?.district || "Karnataka PDS Circle"}, ${data.location?.taluk || "Karnataka"}`;

  // Default to members tab
  switchRosterTab("members");
  container.innerHTML = "";
  appState.selectedMember = null;

  if (members.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">No active members found on this ration card.</div>`;
    return;
  }

  const isKannada = appState.currentLang === "KN";

  members.forEach((member, index) => {
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
  if (btnNavBack) {
    if (appState.step === 0) {
      btnNavBack.classList.add("hidden");
    } else {
      btnNavBack.classList.remove("hidden");
    }
  }
  if (btnNavHome) {
    if (appState.step === 0) {
      btnNavHome.classList.add("hidden");
    } else {
      btnNavHome.classList.remove("hidden");
    }
  }
}

function handleNavBack() {
  hideToast();
  hideErrorModal();

  // If facilities guide modal is open, close it
  const facilitiesGuideModal = document.getElementById("facilitiesGuideModal");
  if (facilitiesGuideModal && !facilitiesGuideModal.classList.contains("hidden")) {
    facilitiesGuideModal.classList.add("hidden");
    document.body.style.overflow = "";
    return;
  }

  // If scanner modal is open, close it
  const scannerModal = document.getElementById("scannerModal");
  if (scannerModal && !scannerModal.classList.contains("hidden")) {
    closeDocumentScanner();
    return;
  }

  if (appState.step === 1) {
    // If currently on Schemes or Ration/Shop tab, return to members selection tab first
    const panelMembers = document.getElementById("panelMembers");
    if (panelMembers && panelMembers.classList.contains("hidden")) {
      switchRosterTab("members");
      return;
    }
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
  updateCaptchaFeedback();
  rcDigitCounter.textContent = "";
  rcDigitCounter.className = "text-[10px] font-mono text-slate-400";
  clearRcError();
  clearCaptchaError();
  setStep(0);
  loadCaptcha();
}
