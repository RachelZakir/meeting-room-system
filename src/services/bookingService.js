const { findBookings } = require('../repositories/bookingRepository');
const prisma = require('../config/db');

const addBooking = async ({ userId, roomId, startTime, endTime }) => {
  return prisma.booking.create({
    data: { userId, roomId, startTime, endTime },
    include: { room: true },
  });
};

const getUserBookings = async (userId) => {
  return await findBookings(userId);
};

module.exports = { addBooking, getUserBookings };
