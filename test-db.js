const prisma = require('./src/config/db');

async function testConnection() {
  try {
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('✅ Database connected successfully!');
    console.log('📅 Database time:', result[0].current_time);
    
    // Count tables to verify schema
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📊 Tables in database:', tables.map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();