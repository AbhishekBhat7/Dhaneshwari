// const { Pool } = require('pg');

// // Database connection pool
// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   ssl: process.env.DB_SSL === 'require' ? { rejectUnauthorized: false } : false,
//   // ssl:
//     // process.env.NODE_ENV === "production"
//     //   ? { rejectUnauthorized: true }
//     //   : false,
//   //   process.env.NODE_ENV === "production"
//   // ? { rejectUnauthorized: false }
//   // : false,

  
//   // Connection pool settings
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// // Test database connection
// const testConnection = async () => {
//   try {
//     const client = await pool.connect();
//     console.log('✅ PostgreSQL Connected Successfully');
//     const result = await client.query('SELECT NOW()');
//     console.log('Database time:', result.rows[0].now);
//     client.release();
//   } catch (error) {
//     console.error('❌ Database connection failed:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = { pool, testConnection };
 

// const { Pool } = require('pg');
// require('dotenv').config();

// // Database connection pool
// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   ssl: process.env.DB_SSL === 'require' ? { rejectUnauthorized: false } : false,

//   // Connection pool settings
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 5000, // ⬅️ Increased from 2000ms — 2s is too short for cloud DB sometimes
// });

// // Test database connection
// const testConnection = async () => {
//   try {
//     const client = await pool.connect();
//     console.log('✅ PostgreSQL Connected Successfully');
//     const result = await client.query('SELECT NOW()');
//     console.log('🕗 Database time:', result.rows[0].now);
//     client.release();
//   } catch (error) {
//     console.error('❌ Database connection failed:', error.message);
//     throw error; // ✅ Throw so caller can handle it — DON’T exit here
//   }
// };

// module.exports = { pool, testConnection };



const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'require' ? { rejectUnauthorized: false } : false,
  
  // Connection pool settings
  max: 20, // Max number of connections in the pool
  idleTimeoutMillis: 30000, // Time before an idle client is closed
  connectionTimeoutMillis: 10000, // Max time to wait for a connection to be established
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL Connected Successfully');
    
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);
    
    client.release(); // Always release the client after use to avoid leaks
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); // Exit if database connection fails
  }
};

module.exports = { pool, testConnection };
