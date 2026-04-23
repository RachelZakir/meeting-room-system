const prisma = require('../config/db');
const { Readable } = require('stream');

// Export Users as CSV
const exportUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const header = 'id,name,email,role,createdAt\n';
    const rows = users
      .map(
        (u) =>
          `${u.id},${u.name},${u.email},${u.role},${u.createdAt.toISOString()}`
      )
      .join('\n');

    const stream = Readable.from(header + rows);
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.setHeader('Content-Type', 'text/csv');
    stream.pipe(res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Export Rooms as CSV
const exportRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      select: { id: true, name: true, capacity: true, createdAt: true },
    });

    const header = 'id,name,capacity,createdAt\n';
    const rows = rooms
      .map(
        (r) => `${r.id},${r.name},${r.capacity},${r.createdAt.toISOString()}`
      )
      .join('\n');

    const stream = Readable.from(header + rows);
    res.setHeader('Content-Disposition', 'attachment; filename=rooms.csv');
    res.setHeader('Content-Type', 'text/csv');
    stream.pipe(res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Export Bookings as CSV
const exportBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        userId: true,
        roomId: true,
        startTime: true,
        endTime: true,
        createdAt: true,
      },
    });

    const header = 'id,userId,roomId,startTime,endTime,createdAt\n';
    const rows = bookings
      .map(
        (b) =>
          `${b.id},${b.userId},${b.roomId},${b.startTime.toISOString()},${b.endTime.toISOString()},${b.createdAt.toISOString()}`
      )
      .join('\n');

    const stream = Readable.from(header + rows);
    res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
    res.setHeader('Content-Type', 'text/csv');
    stream.pipe(res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { exportUsers, exportRooms, exportBookings };
