require('dotenv').config();
const { pool } = require('../config/database');

class DataManager {
  // Check database status
  static async getStatus() {
    const client = await pool.connect();
    
    try {
      const stats = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM partners) as total_partners,
          (SELECT COUNT(*) FROM token) as total_tokens,
          (SELECT COALESCE(SUM(token_count), 0) FROM token) as total_token_count
      `);
      
      return stats.rows[0];
    } finally {
      client.release();
    }
  }

  // Backup data to JSON
  static async backupData() {
    const client = await pool.connect();
    
    try {
      const [users, partners, tokens] = await Promise.all([
        client.query('SELECT * FROM users ORDER BY user_id'),
        client.query('SELECT * FROM partners ORDER BY partner_id'),
        client.query('SELECT * FROM token ORDER BY token_id')
      ]);

      const backup = {
        timestamp: new Date().toISOString(),
        users: users.rows,
        partners: partners.rows,
        tokens: tokens.rows
      };

      const fs = require('fs');
      const backupFile = `backup_${Date.now()}.json`;
      fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
      
      console.log(`✅ Backup created: ${backupFile}`);
      return backupFile;
    } finally {
      client.release();
    }
  }

  // Clean up old tokens (optional maintenance)
  static async cleanupOldTokens(days = 365) {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `DELETE FROM token 
         WHERE issue_date < CURRENT_DATE - INTERVAL '${days} days'
         RETURNING COUNT(*)`
      );
      
      console.log(`🧹 Cleaned up tokens older than ${days} days`);
      return result.rowCount;
    } finally {
      client.release();
    }
  }
}

module.exports = DataManager;
