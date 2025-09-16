require('dotenv').config();
const { pool } = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Creating database tables...');

    // Create Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id BIGSERIAL PRIMARY KEY,
        email CHARACTER VARYING NOT NULL UNIQUE,
        password CHARACTER VARYING,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // Create Partners table
    await client.query(`
      CREATE TABLE IF NOT EXISTS partners (
        partner_id BIGSERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        contact_number INT NOT NULL,
        adhaar_number INT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Partners table created/verified');

    // Create Token table with foreign key
    await client.query(`
      CREATE TABLE IF NOT EXISTS token (
        token_id BIGSERIAL PRIMARY KEY,
        partner_id BIGINT REFERENCES partners(partner_id) ON DELETE CASCADE,
        issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
        token_count INT NOT NULL CHECK (token_count >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Token table created/verified');

    // Create indexes for better performance (IF NOT EXISTS)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_partners_name ON partners(name);
      CREATE INDEX IF NOT EXISTS idx_partners_contact ON partners(contact_number);
      CREATE INDEX IF NOT EXISTS idx_partners_adhaar ON partners(adhaar_number);
      CREATE INDEX IF NOT EXISTS idx_token_partner ON token(partner_id);
      CREATE INDEX IF NOT EXISTS idx_token_date ON token(issue_date);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    console.log('✅ Database indexes created/verified');

    // Create trigger to update updated_at timestamp
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
      CREATE TRIGGER update_partners_updated_at
      BEFORE UPDATE ON partners
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Database triggers created/verified');

    console.log('🎉 Database migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  createTables()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };
