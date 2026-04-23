const prisma = require('../config/db');

const createBooking = async (bookingData) => {
  return await prisma.$transaction(async (tx) => {
    // Check for overlap...no booking the same room at the same time
    const conflict = await tx.booking.findFirst({
      where: {
        roomId: bookingData.roomId,
        AND: [
          { startTime: { lt: bookingData.endTime } },
          { endTime: { gt: bookingData.startTime } },
        ],
      },
    });

    if (conflict) {
      const error = new Error('Booking conflict: room already booked');
      error.statusCode = 422;
      throw error;
    }

    return await tx.booking.create({ data: bookingData });
  });
};

const findBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId },
    include: { room: true },
    orderBy: { startTime: 'asc' },
  });
};

module.exports = { createBooking, findBookings };
