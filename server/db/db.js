const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2'); // Import mysql2 explicitly

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectModule: mysql2,
  pool: {
    max: 5,                  // Maximum number of connections in pool
    min: 0,                  // Minimum number of connections in pool
    acquire: 30000,          // Timeout for acquiring a connection
    idle: 10000,             // Timeout for idle connections
  },
  dialectOptions: {
    connectTimeout: 30000,   // Connection timeout
  },
  logging: false,            // Disable SQL query logging
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
}

testConnection();

module.exports = sequelize;
