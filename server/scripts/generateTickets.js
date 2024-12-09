const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: '../.env' }); // Load environment variables

// Initialize Sequelize instance
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

// Import the Ticket model here
const Ticket = require('../models/Ticket');

// Ticket generation function
const generateTickets = async () => {
  const tickets = [];
  for (let i = 1; i <= 999; i++) {
    const ticketNumber = `FRI${String(i).padStart(3, '0')}`;
    tickets.push({
      ticketNumber,
      available: true,
      reservationDate: new Date(), // Default reservation date
    });
  }

  try {
    // Authenticate the database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Bulk insert tickets
    await Ticket.bulkCreate(tickets, { ignoreDuplicates: true }); // Avoid inserting duplicate tickets
    console.log('Tickets generated and inserted successfully!');
  } catch (error) {
    console.error('Error generating tickets:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

generateTickets();
