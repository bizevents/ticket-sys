const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'slow',
    password: 'Uhgirlu2l8!',
    database: 'ticketdb',
});

connection.connect((err) => {
    if (err) {
        console.error('Connection failed:', err.message);
    } else {
        console.log('Connected successfully to MySQL!');
    }
    connection.end();
});

