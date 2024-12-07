const { Sequelize, DataTypes } = require('sequelize');

// Aiven MySQL connection details
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'bizbazevents-bizbazevents-03a7.l.aivencloud.com', // Replace with your Aiven MySQL host
  port: 27994 , // Replace with the correct port if it's different
  username: 'avnadmin', // Replace with your Aiven database username
  password: 'AVNS_tIapblDP65gM2SIOmds', // Replace with your Aiven database password
  database: 'defaultdb', // Replace with your Aiven database name
  dialectOptions: {
    connectTimeout: 10000, // Optional: Adjust the connection timeout (in milliseconds)
  },
  logging: false, // Optional: Set to true to log SQL queries
});

// Define the Tickets model
const Ticket = sequelize.define('Tickets', {
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
