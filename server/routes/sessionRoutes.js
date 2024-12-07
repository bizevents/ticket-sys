// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Your database connection

// Route to fetch available tickets (no uniqueId needed)
router.get('/', async (req, res) => {
  try {
    // Query the database for all available tickets
    const [rows] = await db.query('SELECT * FROM tickets WHERE available = TRUE');

    if (rows.length === 0) {
      return res.status(404).send({ message: 'No available tickets found' });
    }

    // Send the list of available tickets as the response
    res.json(rows);  // This will be consumed by the front-end
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

module.exports = router;
