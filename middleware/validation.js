const { body, validationResult } = require('express-validator');

const validateRationCard = [
  body('rcNumber').trim().notEmpty().withMessage('Ration card number is required'),
  body('rcNumber').matches(/^[A-Z0-9]{5,25}$/).withMessage('Invalid ration card format'),
  body('captcha').trim().notEmpty().withMessage('Captcha is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateNameMatch = [
  body('applicantName').trim().notEmpty().withMessage('Applicant name is required'),
  body('applicantName').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRationCard,
  validateNameMatch
};