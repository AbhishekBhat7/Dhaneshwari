// services/partnersService.js
const {pool} = require('../config/database');

// const getAllPartners = async () => {
//   const result = await pool.query('SELECT * FROM partners1 ORDER BY partner_id');
//   return result.rows;
// };



const getAllPartners = async (page = 1, limit = 10, search = '') => {
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM partners1 WHERE name ILIKE $1 ORDER BY partner_id LIMIT $2 OFFSET $3';
  let params = [`%${search}%`, limit, offset];
  const result = await pool.query(query, params);
  const totalResult = await pool.query('SELECT COUNT(*) FROM partners1 WHERE name ILIKE $1', [`%${search}%`]);
  return {
    success: true,
    data: result.rows,
    pagination: {
      total: parseInt(totalResult.rows[0].count),
      pages: Math.ceil(parseInt(totalResult.rows[0].count) / limit)
    }
  };
};


const getPartnerById = async (id) => {
  const result = await pool.query('SELECT * FROM partners1 WHERE partner_id = $1', [id]);
  return result.rows[0];
};

const createPartner = async ({ email, name, contact_number, adhaar_number }) => {
  const result = await pool.query(
    `INSERT INTO partners1 (email, name, contact_number, adhaar_number) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [email, name, contact_number, adhaar_number]
  );
  return result.rows[0];
};

const updatePartner = async (id, { email, name, contact_number, adhaar_number }) => {
  const result = await pool.query(
    `UPDATE partners1 SET email=$1, name=$2, contact_number=$3, adhaar_number=$4, updated_at=NOW() WHERE partner_id=$5 RETURNING *`,
    [email, name, contact_number, adhaar_number, id]
  );
  return result.rows[0];
};

const deletePartner = async (id) => {
  await pool.query('DELETE FROM partners1 WHERE partner_id = $1', [id]);
};

const getPartnerByEmail = async (email) => {
  const query = 'SELECT * FROM partners WHERE email = $1'; // PostgreSQL example
  const result = await db.query(query, [email]);
  return result.rows[0];
};

module.exports = {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getPartnerByEmail
};
