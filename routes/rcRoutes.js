const express = require('express');
const router = express.Router();
const { validateRationCard } = require('../middleware/validation');
const fetchKarnatakaRationCard = require('../services/karnatakaAhara').fetchKarnatakaRationCard;

router.post('/verify-rc', validateRationCard, async (req, res, next) => {
  try {
    const { rcNumber } = req.body;
    const cardData = await fetchKarnatakaRationCard(rcNumber);
    res.json({
      success: true,
      data: cardData.data
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;