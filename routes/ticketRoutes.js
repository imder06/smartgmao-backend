// ========================================
// ROUTES TICKETS
// ========================================

const express = require('express');
const router = express.Router();

const {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketStats
} = require('../controllers/ticketController');

const { protect } = require('../middleware/auth');

router.get('/stats', protect, getTicketStats);
router.get('/', protect, getAllTickets);
router.get('/:id', protect, getTicketById);
router.post('/', protect, createTicket);
router.put('/:id', protect, updateTicket);
router.delete('/:id', protect, deleteTicket);

module.exports = router;