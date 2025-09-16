const Partner = require('../models/Partner');
const Token = require('../models/Token');

class DashboardController {
  async getStats(req, res) {
    try {
      // Get all stats in parallel - using real data only
      const [totalPartners, totalTokens, recentTokens] = await Promise.all([
        Partner.getTotalCount(),
        Partner.getTotalTokens(), 
        Token.getRecentTokens(5)
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalPartners,
          totalTokens,
          recentTokens,
          period: 'Last 5 days'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getRecentActivity(req, res) {
    try {
      const { limit = 10 } = req.query;
      const today = new Date().toISOString().split('T')[0];
      
      const recentTokens = await Token.findByDate(today);

      res.status(200).json({
        success: true,
        data: recentTokens.slice(0, parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new DashboardController();
