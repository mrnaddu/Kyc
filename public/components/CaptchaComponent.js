class CaptchaComponent {
  constructor() {
    this.captcha = null;
    this.captchaInput = null;
    this.captchaToken = null;
  }

  async generateCaptcha() {
    const response = await fetch('/api/auth/captcha');
    const data = await response.json();
    this.captcha = data.captcha;
    this.captchaToken = data.token;
    return this.captcha;
  }

  verifyCaptcha(input) {
    return this.captchaToken === input;
  }
}

module.exports = CaptchaComponent;