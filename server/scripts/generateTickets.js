const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file
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

const generateTickets = async () => {
  const tickets = [];
  for (let i = 1; i <= 999; i++) {
    let ticketNumber = `FRI${String(i).padStart(4, '0')}`;
    tickets.push({
      ticketNumber,
      available: true,
      // Add the reservationDate if necessary
      reservationDate: new Date(),  // Add a default or random date if needed
    });
  }

  try {
    await Ticket.bulkCreate(tickets);
    console.log('Tickets generated!');
  } catch (error) {
    console.error('Error generating tickets:', error);
  }
};

generateTickets();
