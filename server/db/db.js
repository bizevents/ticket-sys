// db/db.js
const mysql = require('mysql2');
const config = require('../config');

// Create a MySQL connection pool using the provided config
const pool = mysql.createPool(config.db);

// Export the pool and use promises for asynchronous querying
module.exports = pool.promise();
