const { defineConfig } = require('@prisma/config');

module.exports = defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL, // required for migrate
      adapter: {
        url: process.env.DATABASE_URL, // used by Prisma Client
      },
    },
  },
});
