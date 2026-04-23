const express = require('express');
const { createRoom, listRooms } = require('../controllers/roomController');
const {
  authMiddleware,
  requireRole,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/rooms', authMiddleware, requireRole(['ADMIN']), createRoom);
router.get('/rooms', authMiddleware, listRooms);

// Authenticated users can list rooms
router.get('/rooms', authMiddleware, listRooms);

module.exports = router;
