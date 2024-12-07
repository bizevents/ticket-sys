const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://slow:Uhgirlu2l8!@localhost:3306/ticketdb'); // Replace with your DB connection string

const Ticket = sequelize.define('Ticket', {
  ticketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ticketNumber: {
    type: DataTypes.STRING(10), // Matches varchar(10)
    allowNull: false,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Matches tinyint(1) default
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true, // Optional field
  },
  phoneNumber: {
    type: DataTypes.STRING(255),
    allowNull: true, // Optional field
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true, // Optional field
  },
  reservationDate: {
    type: DataTypes.DATE, // Matches timestamp
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'tickets', // Ensures Sequelize uses the correct table
  timestamps: true, // Maps `createdAt` and `updatedAt`
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = Ticket;

