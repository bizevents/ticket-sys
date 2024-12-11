const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const db = require('./db/db');
const { DataTypes,Op } = require("sequelize"); 
const Ticket = require('./models/Ticket');
const sendBulkSMS = require('./SMS/sendBulkSMS')

const app = express();

app.use(cors({
  origin: "https://ticket-sys-client.vercel.app", 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
  credentials: true,  // If you need to send credentials like cookies
}));

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

/**
 * Generate a unique session-based link for tickets
 */
app.post("/api/tickets/generate", async (req, res) => {
  const { ticketCount } = req.body;

  
  if (!ticketCount || ticketCount <= 0) {
    return res.status(400).json({ error: "Invalid ticket count" });
  }

  // Create a unique session ID using a hash
  const sessionId = crypto.randomBytes(16).toString("hex");

  // Create an array of ticket objects
  const tickets = Array.from({ length: ticketCount }, (_, i) => ({
    ticketNumber: i + 1,
    available: true,
  }));

  const uniqueLink = `https://ticket-sys-client.vercel.app/ticket?sessionId=${sessionId}&ticketCount=${ticketCount}`;

  res.json({ url: uniqueLink });
});

/**
 * Fetch available tickets
 */
app.get('/api/tickets', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT ticket_number, available FROM Tickets WHERE available = TRUE');

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
app.post('/api/tickets/reserve', async (req, res) => {
  const {ticketIds, firstName, lastName, email, phoneNumber } = req.body;

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
    const message = `Dear ${firstName}, your tickets have been reserved successfully.`;
    const recipients = [phoneNumber];

    await sendBulkSMS(recipients, message);


    res.json({ message: 'Tickets reserved successfully!' });
  } catch (error) {
    console.error('Error reserving tickets:', error);
    res.status(500).json({ message: 'Error reserving tickets.' });
  }
});

/**
 * Fetch reserved tickets
 */
app.post('/api/tickets/validate', async (req, res) => {
  const { ticketIds } = req.body;

  try {
    const tickets = await Ticket.findAll({
      where: {
        ticketId: ticketIds,
      },
    });

    const reservedTickets = tickets.filter((ticket) => !ticket.available);

    if (reservedTickets.length > 0) {
      return res.status(400).json({
        message: 'Some tickets are no longer available.',
        reservedTickets: reservedTickets.map((ticket) => ticket.ticketNumber),
      });
    }

    res.json({ message: 'All tickets are still available.' });
  } catch (error) {
    console.error('Error validating tickets:', error);
    res.status(500).json({ message: 'Error validating tickets.' });
  }
});
app.get('/api/tickets/reserved', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT ticket_number,name FROM Tickets WHERE available = FALSE');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No reserved Tickets found' });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/tickets/reserving', async (req, res) => {
  const { firstName,lastName, phoneNumber } = req.query; // Extract user details from query parameters

  if (!firstName || !phoneNumber) {
    return res.status(400).json({ message: 'Name and phone number are required.' });
  }

  try {
    // Query the database for tickets reserved by the user
    const reservedTickets = await Ticket.findAll({
      where: {
        name: { [Op.eq]: `${firstName} ${lastName}` }, // Concatenate first and last names
        phoneNumber: { [Op.eq]: phoneNumber },        // Matches the user's phone number
        available: false, // Ensures only reserved tickets are fetched
      },
    });
    

    if (reservedTickets.length === 0) {
      return res.status(404).json({ message: 'No reserved tickets found for the provided details.' });
    }

    // Respond with the array of reserved tickets
    // Ensure that only the ticket numbers are returned to the frontend
    const ticketNumbers = reservedTickets.map(ticket => ({
      ticket_number: ticket.ticketNumber,
    }));

    res.json(ticketNumbers); // Return the array of ticket numbers
  } catch (err) {
    console.error('Error fetching reserved tickets:', err);
    res.status(500).json({ message: 'Server error.' });
  }});

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running smoothly' });
});

// Start the server
const port = process.env.PORT || 5000
app.listen(port, () => {
  (`Server running on port ${port}`);
});
module.exports = app
