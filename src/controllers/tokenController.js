const Token = require('../models/Token');
const Partner = require('../models/Partner');
const { validationResult } = require('express-validator');

class TokenController {
  async getTokensByDate(req, res) {
    try {
      const { date } = req.query; // Format: YYYY-MM-DD
      
      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date parameter is required'
        });
      }

      const tokens = await Token.findByDate(date);
      const stats = await Token.getStatsByDate(date);

      res.status(200).json({
        success: true,
        data: tokens,
        stats: {
          totalPartners: parseInt(stats.total_partners),
          totalTokens: parseInt(stats.total_tokens)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createToken(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const token = await Token.create(req.body);

      res.status(201).json({
        success: true,
        data: token
      });
    } catch (error) {
      if (error.code === '23503') {
        res.status(400).json({
          success: false,
          message: 'Invalid partner ID'
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    }
  }

  async updateToken(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { id } = req.params;
      const token = await Token.update(id, req.body);

      if (!token) {
        return res.status(404).json({
          success: false,
          message: 'Token not found'
        });
      }

      res.status(200).json({
        success: true,
        data: token
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteToken(req, res) {
    try {
      const { id } = req.params;
      const token = await Token.delete(id);

      if (!token) {
        return res.status(404).json({
          success: false,
          message: 'Token not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Token deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPartnerTokenHistory(req, res) {
    try {
      const { partnerId } = req.params;
      const tokens = await Token.getPartnerTokenHistory(partnerId);

      res.status(200).json({
        success: true,
        data: tokens
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new TokenController();
