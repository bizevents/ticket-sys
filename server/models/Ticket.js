const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/db'); // Ensure you're importing your sequelize instance

const Ticket = sequelize.define('Ticket', {
  ticketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ticketId',  // maps the Sequelize field to the actual database column
  },
  ticketNumber: {
    type: DataTypes.STRING(10), // Ensure the length matches the column in the database
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
  tableName: 'Tickets', // Make sure the table name matches the actual database table name
  timestamps: true,     // Enable timestamps for createdAt and updatedAt fields
  underscored: true,    // Use snake_case for field names (optional)
});

// Sync the model with the database
Ticket.sync({ alter: true })
  .then(() => console.log('Ticket model has been synchronized with the database'))
  .catch((error) => console.error('Error syncing Ticket model:', error));

module.exports = Ticket;

