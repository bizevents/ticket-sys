const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection pool using the provided config
const pool = mysql.createPool({
  host: process.env.DB_HOST,     // e.g., 'localhost' or an external DB host
  user: process.env.DB_USER,     // your database username
  password: process.env.DB_PASSWORD, // your database password
  database: process.env.DB_NAME, // your database name
  waitForConnections: true,
  connectionLimit: 10,           // Adjust as needed
  queueLimit: 0
});

// Export the pool and use promises for asynchronous querying
module.exports = pool.promise();