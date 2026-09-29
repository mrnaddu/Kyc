const ApiService = {
  fetchRationCard: async (rcNumber) => {
    const response = await fetch('/api/rc/verify-rc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rcNumber })
    });
    return response.json();
  },
  generateCaptcha: async () => {
    const response = await fetch('/api/auth/captcha');
    return response.json();
  },
  confirmKyc: async (applicantData, photoBase64) => {
    const response = await fetch('/api/kyc/confirm-kyc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicantData, photoBase64 })
    });
    return response.json();
  }
};

module.exports = ApiService;