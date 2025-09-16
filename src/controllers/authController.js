const { validationResult } = require('express-validator');
const otpService = require('../services/otpService');

class AuthController {
  async sendOTP(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { email } = req.body;
      const result = await otpService.generateAndSendOTP(email);
      res.status(200).json(result);

    } catch (error) {
      console.error('Send OTP error:', error.message);

      if (error.message.includes("Email does not exist")) {
        return res.status(404).json({
          success: false,
          message: "Email address not found in our system"
        });
      }

      if (error.message.includes("Too many requests")) {
        return res.status(429).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again later."
      });
    }
  }

  async verifyOTP(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const { email, otp, token } = req.body;
      const result = await otpService.verifyStatelessOTP(email, otp, token);
      res.status(200).json(result);

    } catch (error) {
      console.error('Verify OTP error:', error.message);

      if (error.message.includes("Invalid OTP") || 
          error.message.includes("OTP expired") ||
          error.message.includes("Invalid token")) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP"
        });
      }

      res.status(500).json({
        success: false,
        message: "OTP verification failed. Please try again."
      });
    }
  }
}

module.exports = new AuthController();
