const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize({
  host: process.env.DB_HOST,          // Your DB host (e.g., localhost, RDS endpoint)
  username: process.env.DB_USER,      // Your DB username
  password: process.env.DB_PASSWORD,  // Your DB password
  database: process.env.DB_NAME,      // Your DB name
  dialect: 'mysql',                   // Dialect (could be mysql, postgres, etc.)
  pool: {
    acquire: 30000,                   // Increase connection acquire timeout (in ms)
    idle: 10000,                      // Increase idle timeout (in ms)
  },
  dialectOptions: {
    connectTimeout: 30000,            // Increase connect timeout (in ms)
  },
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;