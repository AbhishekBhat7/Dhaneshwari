// const express = require('express');
// const partnerController = require('../controllers/partnerController');
// const { authenticateToken } = require('../middleware/auth');
// const { validatePartner } = require('../middleware/validation');

// const router = express.Router();

// router.use(authenticateToken); // Protect all partner routes

// router.get('/', partnerController.getAllPartners);
// router.get('/:id', partnerController.getPartnerById);
// router.post('/', validatePartner, partnerController.createPartner);
// router.get('/email/:email', partnerController.getPartnerByEmail);
// router.put('/:id', validatePartner, partnerController.updatePartner);
// router.delete('/:id', partnerController.deletePartner);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const partnersController = require('../controllers/partnersController1');

// router.get('/', partnersController.getAllPartners);
// router.get('/:id', partnersController.getPartnerById);
// router.get('/email/:email', partnersController.getPartnerByEmail);
// router.post('/', partnersController.createPartner);
// router.put('/:id', partnersController.updatePartner);
// router.delete('/:id', partnersController.deletePartner);

// module.exports = router;




const express = require('express');
const router = express.Router();
const partnersController = require('../controllers/partnersController1');

router.get('/', partnersController.getAllPartners);
router.get('/:id', partnersController.getPartnerById);
router.get('/email/:email', partnersController.getPartnerByEmail);
router.post('/', partnersController.createPartner);
router.put('/:id', partnersController.updatePartner);
router.delete('/:id', partnersController.deletePartner);

module.exports = router;