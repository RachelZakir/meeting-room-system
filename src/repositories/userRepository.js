const prisma = require('../config/db');

const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

module.exports = { createUser, findUserByEmail };