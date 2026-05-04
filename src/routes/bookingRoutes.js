// bookingRoutes.js
const express = require('express');
const {
  createBooking,
  listBookings,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const {
  authMiddleware,
  //requireRole,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/bookings', authMiddleware, createBooking);

// Allow both ADMIN and USER to access - the controller handles the filtering
router.get('/bookings', authMiddleware, listBookings);

router.put('/bookings/:id', authMiddleware, updateBooking);

router.delete('/bookings/:id', authMiddleware, deleteBooking);

module.exports = router;
