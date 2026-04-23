// booking.service.test.js

jest.mock('../config/db', () => ({
  booking: {
    create: jest.fn(),
  },
}));

const { addBooking } = require('../services/bookingService.js');

describe('Booking Service', () => {
  it('should allow a valid booking', async () => {
    // Mock success
    const prisma = require('../config/db');
    prisma.booking.create.mockResolvedValueOnce({
      id: 'booking-123',
      userId: 'test-user-id',
      roomId: 'test-room-id',
      startTime: new Date('2026-04-21T09:00:00'),
      endTime: new Date('2026-04-21T10:00:00'),
      room: { name: 'Conference Room' },
    });

    const booking = await addBooking({
      userId: 'test-user-id',
      roomId: 'test-room-id',
      startTime: new Date('2026-04-21T09:00:00'),
      endTime: new Date('2026-04-21T10:00:00'),
    });

    expect(booking).toBeDefined();
    expect(booking.roomId).toBe('test-room-id');
  });

  it('should throw error if booking conflicts', async () => {
    // Mock conflict
    const prisma = require('../config/db');
    prisma.booking.create.mockRejectedValueOnce(
      new Error('Booking conflict: room already booked')
    );

    await expect(
      addBooking({
        userId: 'test-user-id',
        roomId: 'test-room-id',
        startTime: new Date('2026-04-21T09:30:00'),
        endTime: new Date('2026-04-21T10:30:00'),
      })
    ).rejects.toThrow('Booking conflict: room already booked');
  });
});
