const express = require('express');
const {
  createBooking,
  listBookings,
} = require('../controllers/bookingController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/bookings', authMiddleware, createBooking);
router.get('/bookings', authMiddleware, listBookings);

module.exports = router;
