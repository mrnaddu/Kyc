const crypto = require('crypto');
const { calculateNameMatchScore } = require('./nameMatching');

async function generateKycCertificate(applicantData, photoBase64) {
  // Validate applicant data
  if (!applicantData || !applicantData.name || !applicantData.rcNumber) {
    throw new Error('Invalid applicant data');
  }

  // Simulate name matching
  const nameMatchScore = calculateNameMatchScore(applicantData.name, applicantData.selectedName);
  if (nameMatchScore < 0.7) {
    throw new Error('Name does not match ration card data');
  }

  // Generate certificate data
  const certificate = {
    applicantName: applicantData.name,
    rcNumber: applicantData.rcNumber,
    photo: photoBase64,
    issuedAt: new Date().toISOString(),
    certificateId: crypto.randomBytes(16).toString('hex'),
    verified: true
  };

  return certificate;
}

module.exports = {
  generateKycCertificate
};