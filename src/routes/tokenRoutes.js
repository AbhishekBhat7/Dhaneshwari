const express = require('express');
const tokenController = require('../controllers/tokenController');
const { authenticateToken } = require('../middleware/auth');
const { validateToken } = require('../middleware/validation');

const router = express.Router();

router.use(authenticateToken);

router.get('/', tokenController.getTokensByDate);
router.post('/', validateToken, tokenController.createToken);
router.put('/:id', validateToken, tokenController.updateToken);
router.delete('/:id', tokenController.deleteToken);
router.get('/partner/:partnerId', tokenController.getPartnerTokenHistory);

module.exports = router;
