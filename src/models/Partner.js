// const { pool } = require('../config/database');

// class Partner {
//   static async findAll({ search, page = 1, limit = 10 } = {}) {
//     const client = await pool.connect();
//     try {
//       let query = `
//         SELECT 
//           p.partner_id,
//           p.name,
//           p.contact_number,
//           p.adhaar_number,
//           p.created_at,
//           p.updated_at,
//           COALESCE(SUM(t.token_count), 0) as total_tokens_count
//         FROM partners p
//         LEFT JOIN token t ON p.partner_id = t.partner_id
//       `;
      
//       let countQuery = 'SELECT COUNT(*) FROM partners p';
//       let params = [];
      
//       if (search) {
//         query += ` WHERE (p.name ILIKE $1 OR p.contact_number::text ILIKE $1 OR p.adhaar_number::text ILIKE $1)`;
//         countQuery += ` WHERE (p.name ILIKE $1 OR p.contact_number::text ILIKE $1 OR p.adhaar_number::text ILIKE $1)`;
//         params.push(`%${search}%`);
//       }
      
//       query += ` GROUP BY p.partner_id, p.name, p.contact_number, p.adhaar_number, p.created_at, p.updated_at`;
//       query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
//       params.push(limit, (page - 1) * limit);
      
//       const [dataResult, countResult] = await Promise.all([
//         client.query(query, params),
//         client.query(countQuery, search ? [`%${search}%`] : [])
//       ]);
      
//       return {
//         data: dataResult.rows,
//         total: parseInt(countResult.rows[0].count)
//       };
//     } finally {
//       client.release();
//     }
//   }

//   static async create(partnerData) {
//     const client = await pool.connect();
//     try {
//       const { name, contact_number, adhaar_number } = partnerData;
//       const result = await client.query(
//         `INSERT INTO partners (name, contact_number, adhaar_number) 
//          VALUES ($1, $2, $3) RETURNING *`,
//         [name, parseInt(contact_number), parseInt(adhaar_number)]
//       );
//       return result.rows[0];
//     } finally {
//       client.release();
//     }
//   }

//   static async findById(id) {
//     const client = await pool.connect();
//     try {
//       const result = await client.query(
//         `SELECT 
//           p.*,
//           COALESCE(SUM(t.token_count), 0) as total_tokens_count
//          FROM partners p
//          LEFT JOIN token t ON p.partner_id = t.partner_id
//          WHERE p.partner_id = $1
//          GROUP BY p.partner_id`,
//         [id]
//       );
//       return result.rows[0];
//     } finally {
//       client.release();
//     }
//   }

//   static async update(id, partnerData) {
//     const client = await pool.connect();
//     try {
//       const { name, contact_number, adhaar_number } = partnerData;
//       const result = await client.query(
//         `UPDATE partners 
//          SET name = $1, contact_number = $2, adhaar_number = $3, updated_at = CURRENT_TIMESTAMP
//          WHERE partner_id = $4
//          RETURNING *`,
//         [name, parseInt(contact_number), parseInt(adhaar_number), id]
//       );
//       return result.rows[0];
//     } finally {
//       client.release();
//     }
//   }

//   static async delete(id) {
//     const client = await pool.connect();
//     try {
//       // This will cascade delete tokens due to ON DELETE CASCADE
//       const result = await client.query(
//         'DELETE FROM partners WHERE partner_id = $1 RETURNING *',
//         [id]
//       );
//       return result.rows[0];
//     } finally {
//       client.release();
//     }
//   }

//   static async getTotalCount() {
//     const client = await pool.connect();
//     try {
//       const result = await client.query('SELECT COUNT(*) FROM partners');
//       return parseInt(result.rows[0].count);
//     } finally {
//       client.release();
//     }
//   }

//   static async getTotalTokens() {
//     const client = await pool.connect();
//     try {
//       const result = await client.query(
//         'SELECT COALESCE(SUM(token_count), 0) as total FROM token'
//       );
//       return parseInt(result.rows[0].total);
//     } finally {
//       client.release();
//     }
//   }
// }

// module.exports = Partner;
const { pool } = require('../config/database');

class Partner {
  static async findAll({ search, page = 1, limit = 10 } = {}) {
    const client = await pool.connect();
    try {
      let query = `
        SELECT 
          p.partner_id,
          p.name,
          p.contact_number,
          p.adhaar_number,
          p.created_at,
          p.updated_at,
          COALESCE(SUM(t.token_count), 0) as total_tokens_count
        FROM partners1 p
        LEFT JOIN token t ON p.partner_id = t.partner_id
      `;
      
      let countQuery = 'SELECT COUNT(*) FROM partners p';
      let params = [];
      
      if (search) {
        query += ` WHERE (p.name ILIKE $1 OR p.contact_number::text ILIKE $1 OR p.adhaar_number::text ILIKE $1)`;
        countQuery += ` WHERE (p.name ILIKE $1 OR p.contact_number::text ILIKE $1 OR p.adhaar_number::text ILIKE $1)`;
        params.push(`%${search}%`);
      }
      
      query += ` GROUP BY p.partner_id, p.name, p.contact_number, p.adhaar_number, p.created_at, p.updated_at`;
      query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, (page - 1) * limit);
      
      const [dataResult, countResult] = await Promise.all([
        client.query(query, params),
        client.query(countQuery, search ? [`%${search}%`] : [])
      ]);
      
      return {
        data: dataResult.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  static async create(partnerData) {
    const client = await pool.connect();
    try {
      const { name, contact_number, adhaar_number } = partnerData;
      const result = await client.query(
        `INSERT INTO partners1 (name, contact_number, adhaar_number) 
         VALUES ($1, $2, $3) RETURNING *`,
        [name, parseInt(contact_number), parseInt(adhaar_number)]
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
        `SELECT 
          p.*,
          COALESCE(SUM(t.token_count), 0) as total_tokens_count
         FROM partners1 p
         LEFT JOIN token t ON p.partner_id = t.partner_id
         WHERE p.partner_id = $1
         GROUP BY p.partner_id`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id, partnerData) {
    const client = await pool.connect();
    try {
      const { name, contact_number, adhaar_number } = partnerData;
      const result = await client.query(
        `UPDATE partners1 
         SET name = $1, contact_number = $2, adhaar_number = $3, updated_at = CURRENT_TIMESTAMP
         WHERE partner_id = $4
         RETURNING *`,
        [name, parseInt(contact_number), parseInt(adhaar_number), id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await pool.connect();
    try {
      // This will cascade delete tokens due to ON DELETE CASCADE
      const result = await client.query(
        'DELETE FROM partners1 WHERE partner_id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getTotalCount() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT COUNT(*) FROM partners1');
      return parseInt(result.rows[0].count);
    } finally {
      client.release();
    }
  }

  static async getTotalTokens() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT COALESCE(SUM(token_count), 0) as total FROM token'
      );
      return parseInt(result.rows[0].total);
    } finally {
      client.release();
    }
  }
}

module.exports = Partner;
