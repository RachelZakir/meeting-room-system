const express = require('express');
const {
  exportUsers,
  exportRooms,
  exportBookings,
} = require('../controllers/adminExportController');
const {
  authMiddleware,
  requireRole,
} = require('../middlewares/authMiddleware');

const router = express.Router();

// Only admins should access these routes
router.get(
  '/export/users',
  authMiddleware,
  requireRole(['ADMIN']),
  exportUsers
);
router.get(
  '/export/rooms',
  authMiddleware,
  requireRole(['ADMIN']),
  exportRooms
);
router.get(
  '/export/bookings',
  authMiddleware,
  requireRole(['ADMIN']),
  exportBookings
);

module.exports = router;
