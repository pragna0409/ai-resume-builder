const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  port: 3306
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL successfully!');

    // Read and execute schema file
    console.log('📖 Reading schema file...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log('🏗️  Creating database and tables...');
    
    for (let statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✅ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY' || error.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log('⚠️  Skipped (already exists):', statement.substring(0, 50) + '...');
          } else {
            console.error('❌ Error executing statement:', error.message);
            console.error('Statement:', statement);
          }
        }
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📊 Database Details:');
    console.log('   Host: localhost');
    console.log('   Port: 3306');
    console.log('   Username: root');
    console.log('   Password: admin123');
    console.log('   Database: ai_resume_builder');
    
    console.log('\n🚀 You can now start the backend server with:');
    console.log('   npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure MySQL is running and accessible');
      console.log('   - Check if MySQL service is started');
      console.log('   - Verify the connection details in setup-database.js');
    }
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Check your MySQL credentials');
      console.log('   - Verify username and password');
      console.log('   - Make sure the user has proper permissions');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 