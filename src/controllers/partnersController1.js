// controllers/partnersController.js
const partnersService = require('../services/partnerService1');

const getAllPartners = async (req, res) => {
  try {
    const partners = await partnersService.getAllPartners();
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPartnerById = async (req, res) => {
  try {
    const partner = await partnersService.getPartnerById(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPartner = async (req, res) => {
  try {
    const partner = await partnersService.createPartner(req.body);
    res.status(201).json(partner);
  } catch (err) {
    if (err.code === '23505') { // unique violation for adhaar_number
      return res.status(400).json({ error: 'Adhaar number must be unique' });
    }
    res.status(500).json({ error: err.message });
  }
};

const updatePartner = async (req, res) => {
  try {
    const partner = await partnersService.updatePartner(req.params.id, req.body);
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    res.json(partner);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Adhaar number must be unique' });
    }
    res.status(500).json({ error: err.message });
  }
};

const deletePartner = async (req, res) => {
  try {
    await partnersService.deletePartner(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
};
