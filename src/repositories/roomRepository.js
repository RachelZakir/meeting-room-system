const prisma = require('../config/db');

const createRoom = async (roomData) => {
  // Convert equipment array to JSON string if needed
  const data = {
    ...roomData,
    equipment: roomData.equipment ? JSON.stringify(roomData.equipment) : null
  };
  
  return await prisma.room.create({
    data
  });
};

const findRooms = async (filters = {}, pagination = {}) => {
  const { capacity, equipment } = filters;
  const { limit = 10, offset = 0 } = pagination;
  
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
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' }
  });
  
  // Parse equipment back to array for response
  const formattedRooms = rooms.map(room => ({
    ...room,
    equipment: room.equipment ? JSON.parse(room.equipment) : []
  }));
  
  const total = await prisma.room.count({ where });
  
  return { rooms: formattedRooms, total, limit, offset };
};

module.exports = { createRoom, findRooms };