const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://slow:Uhgirlu2l8!@localhost:3306/ticketdb'); // Replace with your credentials

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
