const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const db = require('./db/db');
const { DataTypes } = require("sequelize"); // Ensure DataTypes is imported
const Ticket = require('./models/Ticket');

const app = express();

// Middleware for cross-origin requests
const corsOptions = {
  origin: ["https://ticket-sys-client.vercel.app", "http://localhost:3000"], // Add both your production and local dev URLs
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Ensure credentials (cookies) are included if necessary
};
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

/**
 * Middleware to validate session links
 */
const checkLinkValidity = async (req, res, next) => {
  const { sessionId } = req.query;

  try {
    const [link] = await db.query('SELECT * FROM links WHERE sessionId = ?', [sessionId]);

    if (!link || link.used || new Date(link.expiresAt) < new Date()) {
      return res.status(404).json({ message: 'This link is invalid or has expired.' });
    }

    next(); // Proceed if link is valid
  } catch (err) {
    console.error('Error validating link:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * Generate a unique session-based link for tickets
 */
app.post("/api/tickets/generate", async (req, res) => {
  const { ticketCount } = req.body;

  if (!ticketCount || ticketCount <= 0) {
    return res.status(400).json({ error: "Invalid ticket count" });
  }

  const sessionId = crypto.randomBytes(16).toString("hex");

  // Set link expiration to 1 hour from now
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await db.query(
    'INSERT INTO links (sessionId, ticketCount, expiresAt) VALUES (?, ?, ?)',
    [sessionId, ticketCount, expiresAt]
  );

  const uniqueLink = `https://ticket-sys-client.vercel.app/tickets?sessionId=${sessionId}&ticketCount=${ticketCount}`;

  res.json({ url: uniqueLink });
});

/**
 * Fetch available tickets
 */
app.get('/api/tickets', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tickets WHERE available = TRUE');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No available tickets found' });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Reserve tickets
 */
app.post('/api/tickets/reserve', checkLinkValidity, async (req, res) => {
  const { sessionId, ticketIds, firstName, lastName, email, phoneNumber } = req.body;

  try {
    // Process ticket reservation
    const tickets = await Ticket.findAll({
      where: { ticketId: ticketIds },
    });

    const reservedTickets = tickets.filter((ticket) => !ticket.available);

    if (reservedTickets.length > 0) {
      return res.status(400).json({
        message: 'Some tickets are no longer available.',
        reservedTickets: reservedTickets.map((ticket) => ticket.ticketNumber),
      });
    }

    await Ticket.update(
      {
        available: false,
        name: `${firstName} ${lastName}`,
        email,
        phoneNumber,
        reservationDate: new Date(),
      },
      {
        where: { ticketId: ticketIds },
      }
    );

    // Mark the link as used
    await db.query('UPDATE links SET used = TRUE WHERE sessionId = ?', [sessionId]);

    res.json({ message: 'Tickets reserved successfully!' });
  } catch (error) {
    console.error('Error reserving tickets:', error);
    res.status(500).json({ message: 'Error reserving tickets.' });
  }
});

/**
 * Fetch reserved tickets
 */
app.get('/api/tickets/reserved', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tickets WHERE available = FALSE');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No reserved tickets found' });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
