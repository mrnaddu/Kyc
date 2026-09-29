const express = require('express');
const router = express.Router();
const { validateNameMatch } = require('../middleware/validation');
const { generateCaptcha, verifyCaptcha } = require('../services/captchaService');

router.get('/captcha', (req, res) => {
  const captcha = generateCaptcha();
  res.json({
    success: true,
    captcha
  });
});

router.post('/verify-captcha', validateNameMatch, async (req, res, next) => {
  try {
    const { captcha, applicantName } = req.body;
    const isValid = verifyCaptcha(captcha, applicantName);
    res.json({
      success: true,
      isValid
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;