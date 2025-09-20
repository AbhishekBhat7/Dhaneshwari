const Partner = require('../models/Partner');
const { validationResult } = require('express-validator');

class PartnerController {
  async getAllPartners(req, res) {
    try {
      const { search, page = 1, limit = 10 } = req.query;
      
      const result = await Partner.findAll({
        search,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(result.total / limit),
          total: result.total
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createPartner(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const partner = await Partner.create(req.body);

      res.status(201).json({
        success: true,
        data: partner
      });
    } catch (error) {
      if (error.code === '23505') {
        res.status(400).json({
          success: false,
          message: 'Adhaar number already exists'
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    }
  }

  async updatePartner(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { id } = req.params;
      const partner = await Partner.update(id, req.body);

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: 'Partner not found'
        });
      }

      res.status(200).json({
        success: true,
        data: partner
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deletePartner(req, res) {
    try {
      const { id } = req.params;
      const partner = await Partner.delete(id);

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: 'Partner not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Partner deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPartnerById(req, res) {
    try {
      const { id } = req.params;
      const partner = await Partner.findById(id);

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: 'Partner not found'
        });
      }

      res.status(200).json({
        success: true,
        data: partner
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

   async getPartnerByEmail(req, res) {
    try {
      const { email } = req.params;
      const result = await partnersService.getPartnerByEmail(email);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Partner not found with this email'
        });
      }

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
};


module.exports = new PartnerController();
