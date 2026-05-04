const express = require('express');
const {
  createRoom,
  listRooms,
  updateRoom,
  removeRoom,
} = require('../controllers/roomController');
const {
  authMiddleware,
  requireRole,
} = require('../middlewares/authMiddleware');

const router = express.Router();

// Only ADMIN can create, update, delete, and list rooms
router.post('/rooms', authMiddleware, requireRole(['ADMIN']), createRoom);
router.get('/rooms', authMiddleware, listRooms);
router.put('/rooms/:id', authMiddleware, requireRole(['ADMIN']), updateRoom);
router.delete('/rooms/:id', authMiddleware, requireRole(['ADMIN']), removeRoom);

module.exports = router;
