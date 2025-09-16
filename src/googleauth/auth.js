const express = require('express');
const client =require('../config/database');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Register user endpoint
const authregister = async (req, res) => {
  const { email, name, firebase_uid } = req.body;
  
  if (!email || !name || !firebase_uid) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

  try {
    // First, check if the user already exists based on email or firebase_uid
    const checkQuery = `
      SELECT email FROM partners
      WHERE email = $1 OR firebase_uid = $2
    `;
    const checkValues = [email, firebase_uid];
    const checkResult = await client.query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists with this email or firebase_uid' });
    }

    // If the user doesn't exist, proceed to insert the new user
    const query = `
      INSERT INTO partners (email, name, firebase_uid)
      VALUES ($1, $2, $3)
      RETURNING email
    `;
    const values = [email, name, firebase_uid];

    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      const usermail = result.rows[0].email;
      // console.log(`User registered with ID: ${userId}`);

      // Send a response with the userId, email, and firebase_uid
      return res.status(201).json({
        message: 'User registered successfully',
        name,
        usermail,
        firebase_uid
      });
    } else {
      return res.status(500).json({ message: 'Failed to register user' });
    }
  } catch (err) {
    console.error('Error during database query:', err);
    return res.status(500).json({ message: 'Error saving user data' });
  }
};

module.exports = {authregister};
