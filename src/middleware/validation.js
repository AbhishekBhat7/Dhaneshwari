const { body } = require('express-validator');

const validateSendOTP = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email address too long'),
];

const validateVerifyOTP = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('otp')
    .trim()
    .isNumeric()
    .withMessage('OTP must be numeric')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits'),

  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token is required')
    .isLength({ min: 10 })
    .withMessage('Invalid token format'),
];

const validatePartner = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2-100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only letters and spaces'),
  
  body('contact_number')
    .isInt({ min: 1000000000, max: 9999999999 })
    .withMessage('Contact number must be exactly 10 digits'),
  
  body('adhaar_number')
    .isInt({ min: 100000000000, max: 999999999999 })
    .withMessage('Adhaar number must be exactly 12 digits'),
];

const validateToken = [
  body('partner_id')
    .isInt({ min: 1 })
    .withMessage('Valid partner ID required'),
  
  body('issue_date')
    .isISO8601()
    .withMessage('Valid date required (YYYY-MM-DD)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (date > today) {
        throw new Error('Issue date cannot be in the future');
      }
      return true;
    }),
  
  body('token_count')
    .isInt({ min: 0 })
    .withMessage('Token count must be a non-negative integer'),
];

module.exports = {
  validateSendOTP,
  validateVerifyOTP,
  validatePartner,
  validateToken,
};
