const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Create a PostgreSQL connection pool with explicit parameters 
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true',
});

// adapter that lets Prisma use the pg pool instead of its own connection.
const adapter = new PrismaPg(pool);

// the Prisma client instance used to query the database.
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
// Then i export this file so other files can require('./config/db') and use it.