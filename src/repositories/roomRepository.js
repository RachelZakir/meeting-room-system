const prisma = require('../config/db');

const createRoom = async (roomData) => {
  // Convert equipment array to JSON string if needed
  const data = {
    ...roomData,
    equipment: roomData.equipment ? JSON.stringify(roomData.equipment) : null,
  };

  return await prisma.room.create({
    data,
  });
};

const findRooms = async (filters = {}, pagination = {}) => {
  const { capacity, equipment } = filters;
  const { offset = 0 } = pagination;

  // Remove the limit default and don't apply take() if no limit specified

  const where = {};

  if (capacity) {
    where.capacity = { gte: parseInt(capacity) };
  }

  if (equipment) {
    where.equipment = { contains: equipment };
  }

  const rooms = await prisma.room.findMany({
    where,
    skip: parseInt(offset),
    // Remove the take() to get all records
    orderBy: { createdAt: 'desc' },
  });

  // Parse equipment back to array for response
  const formattedRooms = rooms.map((room) => ({
    ...room,
    equipment: room.equipment ? JSON.parse(room.equipment) : [],
  }));

  const total = await prisma.room.count({ where });

  return { rooms: formattedRooms, total, limit: rooms.length, offset };
};
const updateRoom = async (id, data) => {
  // Convert equipment array to JSON string if needed
  const updateData = {
    ...data,
    equipment: data.equipment ? JSON.stringify(data.equipment) : undefined,
  };

  return prisma.room.update({
    where: { id },
    data: updateData,
  });
};

const softDeleteRoom = async (id) => {
  return prisma.room.update({
    where: { id },
    data: { isDeleted: true },
  });
};

module.exports = { createRoom, findRooms, updateRoom, softDeleteRoom };
