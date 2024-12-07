const express = require("express");
const crypto = require("crypto");
const db = require('./db/db');
const { Ticket } = require('./models/Ticket'); // Ensure Ticket is imported from Sequelize model

const app = express();

// Middleware for cross-origin requests
const corsOptions = {
  origin: [
    "https://ticket-sys-client.vercel.app",  // Production frontend URL
    "http://localhost:3000"                 // Local development URL
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Ensures cookies or credentials can be sent
};
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

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

  try {
    await db.query(
      'INSERT INTO links (sessionId, ticketCount, expiresAt) VALUES (?, ?, ?)',
      [sessionId, ticketCount, expiresAt]
    );

    const uniqueLink = `https://ticket-sys-client.vercel.app/tickets?sessionId=${sessionId}&ticketCount=${ticketCount}`;

    res.json({ url: uniqueLink });
  } catch (error) {
    console.error("Error generating link:", error);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * Fetch available tickets
 */
app.get('/api/tickets', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Tickets WHERE available = TRUE');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No available tickets found' });
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching available tickets:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Reserve tickets
 */
app.post('/api/tickets/reserve', async (req, res) => {
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
    const [rows] = await db.query('SELECT * FROM Tickets WHERE available = FALSE');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No reserved Tickets found' });
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching reserved tickets:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const port = process.env.PORT || 5000;  // Default to port 5000 if not specified
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
