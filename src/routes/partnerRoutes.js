const express = require('express');
const partnerController = require('../controllers/partnerController');
const { authenticateToken } = require('../middleware/auth');
const { validatePartner } = require('../middleware/validation');

const router = express.Router();

router.use(authenticateToken); // Protect all partner routes

router.get('/', partnerController.getAllPartners);
router.get('/:id', partnerController.getPartnerById);
router.post('/', validatePartner, partnerController.createPartner);
router.put('/:id', validatePartner, partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);

module.exports = router;
