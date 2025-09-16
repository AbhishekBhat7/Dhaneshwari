const express = require('express');
const authController = require('../controllers/authController');
const { validateSendOTP, validateVerifyOTP } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for OTP endpoints
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 OTP requests per 15 minutes per IP
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 verification attempts per 15 minutes per IP
  message: {
    success: false,
    message: 'Too many verification attempts. Please try again later.'
  }
});

router.post('/send-otp', otpLimiter, validateSendOTP, authController.sendOTP);
router.post('/verify-otp', verifyLimiter, validateVerifyOTP, authController.verifyOTP);

module.exports = router;
