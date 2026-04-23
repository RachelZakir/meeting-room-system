const bcrypt = require('bcryptjs');
const { registerUser } = require('../services/userService');

// Mock the userRepository functions so we don’t hit the real DB
jest.mock('../repositories/userRepository', () => ({
  createUser: jest.fn(async (data) => ({ id: '123', ...data })),
  findUserByEmail: jest.fn(async (_email) => null), // default: no user exists
}));

describe('User Service', () => {
  it('should hash passwords correctly when registering', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret123',
    };

    const newUser = await registerUser(userData);

    expect(newUser).toBeDefined();
    expect(newUser.email).toBe('test@example.com');

    // Verify password is hashed
    const isMatch = await bcrypt.compare('secret123', newUser.password);
    expect(isMatch).toBe(true);
  });

  it('should throw error if user already exists', async () => {
    const { findUserByEmail } = require('../repositories/userRepository');
    findUserByEmail.mockResolvedValueOnce({
      id: '123',
      email: 'test@example.com',
    });

    await expect(
      registerUser({
        name: 'Test',
        email: 'test@example.com',
        password: 'secret123',
      })
    ).rejects.toThrow('User already exists with this email');
  });
});
