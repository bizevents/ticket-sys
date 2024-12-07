const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
 // Load environment variables from .env file

// Aiven MySQL connection details
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST, // Aiven MySQL host
  port: process.env.DB_PORT, // Aiven MySQL port
  username: process.env.DB_USER, // Aiven database username
  password: process.env.DB_PASSWORD, // Aiven database password
  database: process.env.DB_NAME, // Aiven database name
  dialectOptions: {
    connectTimeout: 10000, // Connection timeout (in milliseconds)
  },
  logging: process.env.DB_LOGGING === 'true', // Enable logging if DB_LOGGING=true in .env
});

module.exports = sequelize;

// Define the Tickets model
const Ticket = sequelize.define('Ticket', {
  ticketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ticketNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reservationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'Tickets',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    // Sync the model to the database (optional)
    await sequelize.sync();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Run the test connection function
testConnection()
  .then(() => {
    console.log('Ready to perform database operations.');
    // Perform further database operations here if needed
  })
  .catch((err) => {
    console.error('An error occurred during initialization:', err);
  });

module.exports = Ticket;
