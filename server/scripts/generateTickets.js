const { Sequelize, DataTypes } = require('sequelize');
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
