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



const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 20000,
  max: 10,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,
});

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database.");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err.stack);
  });

module.exports = {pool};
