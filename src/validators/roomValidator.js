const z = require('zod');

const roomSchema = z.object({
  name: z.string().min(3, 'Room name must be at least 3 characters'),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
  equipment: z.array(z.string()).optional()
});

module.exports = { roomSchema };