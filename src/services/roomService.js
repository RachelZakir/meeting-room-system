const { createRoom, findRooms } = require('../repositories/roomRepository');

const addRoom = async (roomData) => {
  // You can add business logic here (e.g., check if room name already exists)
  return await createRoom(roomData);
};

const getRooms = async (query) => {
  const { capacity, equipment, limit = 10, offset = 0 } = query;
  const filters = { capacity, equipment };
  const pagination = { limit, offset };
  
  return await findRooms(filters, pagination);
};

module.exports = { addRoom, getRooms };