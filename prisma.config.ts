require('dotenv/config');

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
//This file is used by Prisma CLI to load the database URL when running commands. 
// It ensures DATABASE_URL is loaded from .env