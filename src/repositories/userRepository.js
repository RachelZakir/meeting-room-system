const prisma = require('../config/db');

const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

const findUserByEmail = async (email) => {
  // Exclude soft‑deleted users
  return await prisma.user.findFirst({
    where: { email, isDeleted: false },
  });
};

const findUserById = async (id) => {
  // Only one definition, excludes deleted users and hides password
  return prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
};

const listUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { isDeleted: false },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where: { isDeleted: false } }),
  ]);
  return { users, total };
};

const softDeleteUser = async (id) => {
  return prisma.user.update({
    where: { id },
    data: { isDeleted: true },
    select: { id: true, name: true, email: true, role: true },
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  listUsers,
  softDeleteUser,
};
