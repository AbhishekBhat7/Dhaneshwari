require('dotenv').config();
const { pool } = require('../config/database');
const { createTables } = require('./migrate');

const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding (preserving existing data)...');
    
    // First ensure tables exist
    await createTables();
    
    // Check and create admin user only if doesn't exist
    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@daneshwari.com']
    );
    
    if (existingUser.rows.length === 0) {
      const userResult = await client.query(
        `INSERT INTO users (email) VALUES ($1) RETURNING *`,
        ['admin@daneshwari.com']
      );
      console.log(`✅ Admin user created: ${userResult.rows[0].email}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${existingUser.rows[0].email}`);
    }
    
    // Get current database statistics
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM partners) as total_partners,
        (SELECT COUNT(*) FROM token) as total_tokens,
        (SELECT COALESCE(SUM(token_count), 0) FROM token) as total_token_count
    `);
    
    console.log('\n📊 Current database status:');
    console.log(`👥 Users: ${stats.rows[0].total_users}`);
    console.log(`🤝 Partners: ${stats.rows[0].total_partners}`);
    console.log(`🎫 Token records: ${stats.rows[0].total_tokens}`);
    console.log(`📈 Total token count: ${stats.rows[0].total_token_count}`);
    
    if (stats.rows[0].total_partners > 0) {
      // Display recent partners
      const recentPartners = await client.query(`
        SELECT 
          p.name,
          p.contact_number,
          COALESCE(SUM(t.token_count), 0) as total_tokens
        FROM partners p
        LEFT JOIN token t ON p.partner_id = t.partner_id
        GROUP BY p.partner_id, p.name, p.contact_number
        ORDER BY p.created_at DESC
        LIMIT 5
      `);
      
      console.log('\n🆕 Recent partners:');
      recentPartners.rows.forEach(partner => {
        console.log(`   📝 ${partner.name} (${partner.contact_number}) - ${partner.total_tokens} tokens`);
      });
    }
    
    if (stats.rows[0].total_tokens > 0) {
      // Display recent token activity
      const recentTokens = await client.query(`
        SELECT 
          p.name,
          t.issue_date,
          t.token_count
        FROM token t
        JOIN partners p ON t.partner_id = p.partner_id
        ORDER BY t.created_at DESC
        LIMIT 5
      `);
      
      console.log('\n🎫 Recent token activity:');
      recentTokens.rows.forEach(token => {
        console.log(`   📅 ${token.issue_date}: ${token.name} - ${token.token_count} tokens`);
      });
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📧 Login with: admin@daneshwari.com');
    console.log('🔑 Use OTP authentication to get access token');
    
    if (stats.rows[0].total_partners === 0) {
      console.log('\n💡 Tip: Your database is empty. Add partners through the web interface or API.');
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Function to add a single partner (can be called separately)
const addPartner = async (name, contactNumber, adhaarNumber) => {
  const client = await pool.connect();
  
  try {
    // Check if partner with this adhaar number already exists
    const existing = await client.query(
      'SELECT * FROM partners WHERE adhaar_number = $1',
      [adhaarNumber]
    );
    
    if (existing.rows.length > 0) {
      console.log(`⚠️  Partner with Adhaar ${adhaarNumber} already exists`);
      return existing.rows[0];
    }
    
    const result = await client.query(
      `INSERT INTO partners (name, contact_number, adhaar_number) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, contactNumber, adhaarNumber]
    );
    
    console.log(`✅ Partner added: ${result.rows[0].name}`);
    return result.rows[0];
    
  } catch (error) {
    console.error('❌ Failed to add partner:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Function to add a token record (can be called separately)
const addToken = async (partnerId, issueDate, tokenCount) => {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `INSERT INTO token (partner_id, issue_date, token_count) 
       VALUES ($1, $2, $3) RETURNING *`,
      [partnerId, issueDate, tokenCount]
    );
    
    console.log(`✅ Token added: ${tokenCount} tokens for partner ${partnerId} on ${issueDate}`);
    return result.rows[0];
    
  } catch (error) {
    console.error('❌ Failed to add token:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { 
  seedDatabase, 
  addPartner, 
  addToken 
};
