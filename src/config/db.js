const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Create a PostgreSQL connection pool with explicit parameters
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'meeting_room_db',
  user: 'postgres',
  password: 'R@123456789',  // Your actual password without encoding
  ssl: false,  // Disable SSL for local development
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;