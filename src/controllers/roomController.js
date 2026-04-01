const { addRoom, getRooms } = require('../services/roomService');
const { roomSchema } = require('../validators/roomValidator');

const createRoom = async (req, res, next) => {
  try {
    const validatedData = roomSchema.parse(req.body);
    const room = await addRoom(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    next(error);
  }
};

const listRooms = async (req, res, next) => {
  try {
    const { capacity, equipment, limit, offset } = req.query;
    const result = await getRooms({ capacity, equipment, limit, offset });
    
    res.json({
      success: true,
      data: result.rooms,
      pagination: {
        total: result.total,
        limit: parseInt(result.limit),
        offset: parseInt(result.offset),
        hasMore: parseInt(result.offset) + parseInt(result.limit) < result.total
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRoom, listRooms };