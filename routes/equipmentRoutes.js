// ========================================
// ROUTES ÉQUIPEMENTS
// ========================================

const express = require('express');
const router = express.Router();

const {
  getAllEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} = require('../controllers/equipmentController');

const { protect } = require('../middleware/auth');

router.get('/', protect, getAllEquipments);
router.get('/:id', protect, getEquipmentById);
router.post('/', protect, createEquipment);
router.put('/:id', protect, updateEquipment);
router.delete('/:id', protect, deleteEquipment);

module.exports = router;