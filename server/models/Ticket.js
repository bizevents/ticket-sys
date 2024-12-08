const { DataTypes } = require('sequelize');
const sequelize = require('./db');

// Define a Ticket model
const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ticketNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // Add other fields as necessary
});

// Sync the model with the database
Ticket.sync()
  .then(() => console.log('Ticket model has been synchronized with the database'))
  .catch((error) => console.error('Error syncing Ticket model:', error));

module.exports = Ticket;
