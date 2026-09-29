const express = require('express');
const router = express.Router();
const { generateKycCertificate } = require('../services/kycEngine');

router.post('/confirm-kyc', async (req, res, next) => {
  try {
    const { applicantData, photoBase64 } = req.body;
    const certificate = await generateKycCertificate(applicantData, photoBase64);
    res.json({
      success: true,
      certificate
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;