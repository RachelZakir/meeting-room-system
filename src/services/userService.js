const bcrypt = require('bcryptjs');
const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  listUsers,
  softDeleteUser,
} = require('../repositories/userRepository');

const registerUser = async (userData) => {
  // Check if user already exists no duplicate emails
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // bcrypt to hash the password with 10 salt rounds
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create new user
  const newUser = await createUser({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });

  return newUser;
};
const editUser = async (id, userData) => {
  const user = await findUserById(id);
  if (!user || user.isDeleted) throw new Error('User not found');
  return updateUser(id, userData);
};

const getUsers = async (page, limit) => {
  return listUsers(page, limit);
};

const deleteUser = async (id) => {
  const user = await findUserById(id);
  if (!user || user.isDeleted) throw new Error('User not found');
  return softDeleteUser(id);
};

module.exports = { registerUser, editUser, getUsers, deleteUser };
