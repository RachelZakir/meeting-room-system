const { addRoom, getRooms } = require('../services/roomService');
const { roomSchema } = require('../validators/roomValidator');

const createRoom = async (req, res) => {
  const validatedData = roomSchema.parse(req.body);
  const room = await addRoom(validatedData);

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    data: room,
  });
};

const listRooms = async (req, res) => {
  const { capacity, equipment, limit, offset } = req.query;
  const result = await getRooms({ capacity, equipment, limit, offset });

  res.json({
    success: true,
    data: result.rooms,
    pagination: {
      total: result.total,
      limit: parseInt(result.limit),
      offset: parseInt(result.offset),
      hasMore: parseInt(result.offset) + parseInt(result.limit) < result.total,
    },
  });
};

module.exports = { createRoom, listRooms };
