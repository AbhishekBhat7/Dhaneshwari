const { pool } = require('../config/database');

class User {
  static async findByEmail(email) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async create(userData) {
    const client = await pool.connect();
    try {
      const { email, password = null } = userData;
      const result = await client.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, password]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE user_id = $1',
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async updatePassword(id, hashedPassword) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
        [hashedPassword, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

module.exports = User;
