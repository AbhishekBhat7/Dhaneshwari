// const partnersService = require('../services/partnerService');

// const getAllPartners = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;
//     const result = await partnersService.getAllPartners(parseInt(page), parseInt(limit), search);

//     res.json({
//       success: true,
//       data: result.rows,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(result.total / limit),
//         total: result.total
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const getPartnerById = async (req, res) => {
//   try {
//     const partner = await partnersService.getPartnerById(req.params.id);
//     if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
//     res.json({ success: true, data: partner });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const createPartner = async (req, res) => {
//   try {
//     const partner = await partnersService.createPartner(req.body);
//     res.status(201).json({ success: true, data: partner });
//   } catch (err) {
//     if (err.code === '23505') {
//       return res.status(400).json({ success: false, message: 'Adhaar number must be unique' });
//     }
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const updatePartner = async (req, res) => {
//   try {
//     const partner = await partnersService.updatePartner(req.params.id, req.body);
//     if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
//     res.json({ success: true, data: partner });
//   } catch (err) {
//     if (err.code === '23505') {
//       return res.status(400).json({ success: false, message: 'Adhaar number must be unique' });
//     }
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const deletePartner = async (req, res) => {
//   try {
//     await partnersService.deletePartner(req.params.id);
//     res.status(204).send();
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// const getPartnerByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const result = await partnersService.getPartnerByEmail(email);
//     if (!result) return res.status(404).json({ success: false, message: 'Partner not found with this email' });
//     res.json({ success: true, data: result });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// module.exports = {
//   getAllPartners,
//   getPartnerById,
//   createPartner,
//   updatePartner,
//   deletePartner,
//   getPartnerByEmail
// };











// const partnersService = require('../services/partnerService1');

// // const getAllPartners = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 10, search = '' } = req.query;
// //     const result = await partnersService.getAllPartners(parseInt(page), parseInt(limit), search);

// //     res.json({
// //       success: true,
// //       data: result.rows,
// //       pagination: {
// //         current: parseInt(page),
// //         pages: Math.ceil(result.total / limit),
// //         total: result.total
// //       }
// //     });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// const getPartnerById = async (req, res) => {
//   try {
//     const partner = await partnersService.getPartnerById(req.params.id);
//     if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
//     res.json({ success: true, data: partner });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const createPartner = async (req, res) => {
//   try {
//     const partner = await partnersService.createPartner(req.body);
//     res.status(201).json({ success: true, data: partner });
//   } catch (err) {
//     if (err.code === '23505') {
//       return res.status(400).json({ success: false, message: 'Adhaar number must be unique' });
//     }
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const updatePartner = async (req, res) => {
//   try {
//     const partner = await partnersService.updatePartner(req.params.id, req.body);
//     if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
//     res.json({ success: true, data: partner });
//   } catch (err) {
//     if (err.code === '23505') {
//       return res.status(400).json({ success: false, message: 'Adhaar number must be unique' });
//     }
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const deletePartner = async (req, res) => {
//   try {
//     await partnersService.deletePartner(req.params.id);
//     res.status(204).send();
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const getPartnerByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const result = await partnersService.getPartnerByEmail(email);
//     if (!result) return res.status(404).json({ success: false, message: 'Partner not found with this email' });
//     res.json({ success: true, data: result });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// const getAllPartners = async (req, res) => {
//   try {
//     const { search, page = 1, limit = 10 } = req.query;
    
//     const result = await Partner.findAll({
//       search,
//       page: parseInt(page),
//       limit: parseInt(limit)
//     });

//     res.status(200).json({
//       success: true,
//       data: result.data,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(result.total / limit),
//         total: result.total
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   getAllPartners,
//   getPartnerById,
//   createPartner,
//   updatePartner,
//   deletePartner,
//   getPartnerByEmail
// };

const partnersService = require('../services/partnerService1');

const getAllPartners = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await partnersService.getAllPartners(parseInt(page), parseInt(limit), search);

    res.status(200).json({
      success: result.success,
      data: result.data,
      pagination: {
        current: parseInt(page),
        pages: result.pagination.pages,
        total: result.pagination.total
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPartnerById = async (req, res) => {
  try {
    const partner = await partnersService.getPartnerById(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: partner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createPartner = async (req, res) => {
  try {
    const partner = await partnersService.createPartner(req.body);
    res.status(201).json({ success: true, data: partner });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'Adhaar number must be unique' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const updatePartner = async (req, res) => {
  try {
    const partner = await partnersService.updatePartner(req.params.id, req.body);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    res.json({ success: true, data: partner });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'Adhaar number must be unique' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const deletePartner = async (req, res) => {
  try {
    await partnersService.deletePartner(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPartnerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await partnersService.getPartnerByEmail(email);
    if (!result) return res.status(404).json({ success: false, message: 'Partner not found with this email' });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getPartnerByEmail
};