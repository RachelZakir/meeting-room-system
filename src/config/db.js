const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Create a PostgreSQL connection pool with explicit parameters
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'meeting_room_db',
  user: 'postgres',
  password: 'R@123456789', // This is a string, so why error?
  ssl: false,
});

// adapter that lets Prisma use the pg pool instead of its own connection.
const adapter = new PrismaPg(pool);

// the Prisma client instance used to query the database.
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
// Then i export this file so other files can require('./config/db') and use it.
