const express = require('express');
const router = express.Router(); 
const {authregister} = require('../googleauth/auth');
const {authlogin} = require('../googleauth/authLogin');

router.post('/authregister', authregister);  
router.post('/authlogin', authlogin); 

module.exports = router;
