class RationCardLookupView {
  constructor() {
    this.captchaComponent = new (require('../components/CaptchaComponent'))();
    this.apiService = require('../utils/api');
  }

  async lookupRationCard(rcNumber) {
    try {
      const captcha = await this.captchaComponent.generateCaptcha();
      const response = await this.apiService.fetchRationCard(rcNumber);
      return {
        success: true,
        data: response.data,
        captcha
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch ration card data'
      };
    }
  }
}

module.exports = RationCardLookupView;