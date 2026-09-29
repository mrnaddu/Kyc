// Main Application Controller
const ApiService = require('./utils/api');
const CaptchaComponent = require('./components/CaptchaComponent').default || require('./components/CaptchaComponent');
const QRScannerComponent = require('./components/QRScannerComponent').default || require('./components/QRScannerComponent');
const RationCardLookupView = require('./views/RationCardLookupView').default || require('./views/RationCardLookupView');
const FamilyRosterView = require('./views/FamilyRosterView').default || require('./views/FamilyRosterView');

// Initialize components
const captchaComponent = new CaptchaComponent();
const qrScannerComponent = new QRScannerComponent();
const rationCardLookupView = new RationCardLookupView();
const familyRosterView = new FamilyRosterView();

// Main application logic
async function initApp() {
  // Initialize QR scanner
  qrScannerComponent.initScanner();

  // Handle QR scan
  qrScannerComponent.scanner.onScanSuccess = (decodedText) => {
    document.getElementById('rcNumberInput').value = decodedText;
    qrScannerComponent.stopScanner();
    document.getElementById('qrScanButton').style.display = 'none';
    document.getElementById('lookupButton').style.display = 'inline-block';
  };

  // Handle form submission
  document.getElementById('lookupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const rcNumber = document.getElementById('rcNumberInput').value.trim();
    const result = await rationCardLookupView.lookupRationCard(rcNumber);
    
    if (result.success) {
      const cardData = result.data;
      const members = familyRosterView.getFamilyMembers(cardData);
      displayFamilyRoster(members);
    } else {
      alert(result.error);
    }
  });
}

function displayFamilyRoster(members) {
  const rosterContainer = document.getElementById('familyRoster');
  rosterContainer.innerHTML = '';
  members.forEach(member => {
    const memberElement = document.createElement('div');
    memberElement.innerHTML = `<p>${member.nameEn} (${member.id})</p>`;
    rosterContainer.appendChild(memberElement);
  });
}

// Initialize the app
initApp();