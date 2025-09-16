const express = require('express');
const { pool } = require('../config/database');
const bodyParser = require('body-parser');
const app = express(); 
app.use(bodyParser.json());
  
 
  const authlogin = async (req, res) => {
  const { email } = req.body;  

  if (!email) {
    return res.status(400).json({ message: 'Email is required' }); 
  }
  

  try { 
    const checkQuery = `
      SELECT  email, name, firebase_uid
      FROM partners
      WHERE email = $1 
    `;
    const checkValues = [email];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
 
      return res.status(404).json({ message: 'User not found' });
    }

    const user = checkResult.rows[0];
    console.log(`User logged in with ID: ${user.email}`);
  
    return res.status(200).json({
      message: 'Login successful',
       email: user.email,
      name: user.name,
      firebase_uid: user.firebase_uid
    });

  } catch (err) {
    console.error('Error during database query:', err);
    return res.status(500).json({ message: 'Error during login' });
  }
};

 
module.exports = {authlogin};