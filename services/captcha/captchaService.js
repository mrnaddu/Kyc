const crypto = require('crypto');

function generateCaptcha() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

function verifyCaptcha(storedCaptcha, userInput) {
  // In a real application, storedCaptcha would be stored in a session
  // For this example, we'll simulate verification
  const isValid = storedCaptcha === userInput;
  return isValid;
}

module.exports = {
  generateCaptcha,
  verifyCaptcha
};