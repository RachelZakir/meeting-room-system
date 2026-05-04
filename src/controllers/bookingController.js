const { PrismaClient } = require('@prisma/client');
const { findUserById } = require('../repositories/userRepository');
const { Worker } = require('worker_threads');
const path = require('path');
const {
  //addBooking,
  getUserBookings,
  editBooking,
  removeBooking,
  getAllBookings,
} = require('../services/bookingService');

const prisma = new PrismaClient();

// Helper function to run the PDF worker
const generateBookingPdf = (bookingData) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      path.resolve(__dirname, '../workers/bookingPdfWorker.js')
    );

    worker.postMessage(bookingData);

    worker.on('message', (result) => {
      if (result.success) {
        resolve(result.filePath);
      } else {
        reject(new Error(result.error));
      }
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
};

const createBooking = async (req, res) => {
  const { roomId, startTime, endTime } = req.body;

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const conflict = await tx.booking.findFirst({
        where: {
          roomId,
          startTime: { lt: new Date(endTime) },
          endTime: { gt: new Date(startTime) },
        },
      });

      if (conflict) {
        throw new Error('Room already booked in this time slot');
      }

      return await tx.booking.create({
        data: {
          userId: req.user.id,
          roomId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
        include: { room: true },
      });
    });

    const user = await findUserById(req.user.id);

    const filePath = await generateBookingPdf({
      id: booking.id,
      userName: user?.name || 'Unknown',
      roomName: booking.room?.name || 'Room',
      startTime: booking.startTime,
      endTime: booking.endTime,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
      pdf: filePath,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const listBookings = async (req, res) => {
  if (req.user.role === 'ADMIN') {
    const bookings = await getAllBookings();
    return res.json({ success: true, data: bookings });
  }
  const bookings = await getUserBookings(req.user.id);
  res.json({ success: true, data: bookings });
};

const updateBooking = async (req, res) => {
  try {
    const booking = await editBooking(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    res.json({ success: true, message: 'Booking updated', data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await removeBooking(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.json({ success: true, message: 'Booking deleted', data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createBooking,
  listBookings,
  updateBooking,
  deleteBooking,
};
