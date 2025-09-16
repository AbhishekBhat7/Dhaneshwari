const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class StatelessOTPService {
  constructor() {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "mail.rosettesmartlife.com",
      port: parseInt(process.env.EMAIL_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // OTP configuration
    this.OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
    this.COOLDOWN_SECONDS = parseInt(process.env.OTP_COOLDOWN_SECONDS) || 30;
    this.SECRET_KEY = process.env.JWT_SECRET;
    
    // Simple in-memory rate limiting
    this.rateLimitCache = new Map();
  }

  // Generate 6-digit OTP
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Generate stateless OTP token using HMAC
  generateOTPToken(email, otp) {
    const expires = Date.now() + (this.OTP_EXPIRY_MINUTES * 60 * 1000);
    const data = `${email}.${otp}.${expires}`;
    const hmac = crypto.createHmac('sha256', this.SECRET_KEY);
    hmac.update(data);
    const hash = hmac.digest('hex');
    return `${hash}.${expires}`;
  }

  // Verify OTP token without server storage
  verifyOTPToken(email, otp, token) {
    try {
      const [receivedHash, expires] = token.split('.');
      
      if (!receivedHash || !expires) {
        return { valid: false, reason: 'Invalid token format' };
      }

      if (Date.now() > parseInt(expires)) {
        return { valid: false, reason: 'OTP expired' };
      }

      const data = `${email}.${otp}.${expires}`;
      const hmac = crypto.createHmac('sha256', this.SECRET_KEY);
      hmac.update(data);
      const expectedHash = hmac.digest('hex');

      if (receivedHash === expectedHash) {
        return { valid: true };
      } else {
        return { valid: false, reason: 'Invalid OTP' };
      }
    } catch (error) {
      return { valid: false, reason: 'Token verification failed' };
    }
  }

  // Rate limiting check
  checkRateLimit(email) {
    const now = Date.now();
    const userAttempts = this.rateLimitCache.get(email) || [];
    
    // Clean old attempts (older than 15 minutes)
    const recentAttempts = userAttempts.filter(time => now - time < 15 * 60 * 1000);
    
    if (recentAttempts.length >= 5) {
      return {
        allowed: false,
        remainingTime: Math.ceil((recentAttempts[0] + 15 * 60 * 1000 - now) / 1000)
      };
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.rateLimitCache.set(email, recentAttempts);
    
    return { allowed: true };
  }

  // Send OTP email
  async sendOTPEmail(email, otp) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔐 Your Login OTP for Daneshwari Collections",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; background-color: #f7f7f7; padding: 20px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
              
              <!-- Header with Logo -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #1DB584 0%, #16A085 100%); padding: 15px; border-radius: 50%; margin-bottom: 20px;">
                  <span style="color: white; font-size: 24px; font-weight: bold;">DC</span>
                </div>
                <h2 style="color: #1DB584; margin: 0; font-size: 28px;">Daneshwari Collections</h2>
                <p style="color: #666; margin: 5px 0 0 0; font-size: 16px;">Secure Login Verification</p>
              </div>

              <!-- OTP Section -->
              <div style="text-align: center; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 18px; color: #333; margin-bottom: 15px;">
                  Hello <strong style="color: #1DB584;">${email}</strong>,
                </p>
                <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
                  Your secure login code is:
                </p>
                <div style="font-size: 36px; font-weight: bold; color: #1DB584; background: white; padding: 20px; border-radius: 8px; border: 2px dashed #1DB584; display: inline-block; letter-spacing: 3px;">
                  ${otp}
                </div>
              </div>

              <!-- Instructions -->
              <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px; text-align: center;">
                  ⏰ This code expires in <strong>${this.OTP_EXPIRY_MINUTES} minutes</strong><br>
                  🔒 For security reasons, do not share this code with anyone
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  If you didn't request this code, please ignore this email.<br>
                  This is an automated message, please do not reply.
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Main OTP generation function
  async generateAndSendOTP(email) {
    try {
      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error("Email does not exist");
      }

      // Check rate limiting
      const rateLimitCheck = this.checkRateLimit(email);
      if (!rateLimitCheck.allowed) {
        throw new Error(`Too many requests. Please try again in ${Math.ceil(rateLimitCheck.remainingTime / 60)} minutes`);
      }

      // Generate OTP and token
      const otp = this.generateOTP();
      const token = this.generateOTPToken(email, otp);

      // Send email
      await this.sendOTPEmail(email, otp);

      return {
        success: true,
        message: "OTP sent successfully",
        token: token,
        expiresIn: `${this.OTP_EXPIRY_MINUTES} minutes`
      };

    } catch (error) {
      throw error;
    }
  }

  // Verify OTP using stateless token
  async verifyStatelessOTP(email, otp, token) {
    try {
      // Verify the token and OTP
      const verification = this.verifyOTPToken(email, otp, token);
      
      if (!verification.valid) {
        throw new Error(verification.reason || "Invalid OTP");
      }

      // Get user details
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      // Generate JWT token for authentication
      const authToken = jwt.sign(
        { 
          userId: user.user_id, 
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      // Clean up rate limiting cache
      this.rateLimitCache.delete(email);

      return {
        success: true,
        message: "OTP verified successfully",
        token: authToken,
        user: {
          id: user.user_id,
          email: user.email
        }
      };

    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StatelessOTPService();
