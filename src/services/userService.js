const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../repositories/userRepository');

const registerUser = async (userData) => {
  // Check if user already exists
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Create user
  const newUser = await createUser({
    name: userData.name,
    email: userData.email,
    password: hashedPassword
  });
  
  return newUser;
};

module.exports = { registerUser };