const { pool } = require('../config/database');

class Token {
  static async findByDate(date) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT 
          t.token_id,
          t.partner_id,
          t.issue_date,
          t.token_count,
          t.created_at,
          p.name as partner_name,
          p.contact_number
         FROM token t 
         JOIN partners1 p ON t.partner_id = p.partner_id 
         WHERE t.issue_date = $1 
         ORDER BY t.created_at DESC`,
        [date]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async create(tokenData) {
    const client = await pool.connect();
    try {
      const { partner_id, issue_date, token_count } = tokenData;
      const result = await client.query(
        `INSERT INTO token (partner_id, issue_date, token_count) 
         VALUES ($1, $2, $3) RETURNING *`,
        [partner_id, issue_date, token_count]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id, tokenData) {
    const client = await pool.connect();
    try {
      const { partner_id, issue_date, token_count } = tokenData;
      const result = await client.query(
        `UPDATE token 
         SET partner_id = $1, issue_date = $2, token_count = $3
         WHERE token_id = $4 RETURNING *`,
        [partner_id, issue_date, token_count, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM token WHERE token_id = $1 RETURNING *', [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getRecentTokens(days = 5) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT COALESCE(SUM(token_count), 0) as total 
         FROM token 
         WHERE issue_date >= CURRENT_DATE - INTERVAL '${days} days'`
      );
      return parseInt(result.rows[0].total);
    } finally {
      client.release();
    }
  }

  static async getStatsByDate(date) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT 
           COUNT(DISTINCT partner_id) as total_partners,
           COALESCE(SUM(token_count), 0) as total_tokens
         FROM token 
         WHERE issue_date = $1`,
        [date]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getPartnerTokenHistory(partnerId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM token 
         WHERE partner_id = $1 
         ORDER BY issue_date DESC`,
        [partnerId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = Token;
