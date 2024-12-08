const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const db = require('./server/db/db'); // Import your database connection

const app = express();

// Middleware for cross-origin requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory store for session tickets (for session-based functionality)
const sessionTickets = {};  // Stores sessionId -> tickets mapping

// Route to generate a unique link with ticket count
app.post("/api/tickets/generate", (req, res) => {
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

  // Store the session tickets in memory
  sessionTickets[sessionId] = tickets;

  // Generate the URL with the ticket count as a query parameter
  const uniqueLink = http://localhost:3000/tickets?sessionId=${sessionId}&ticketCount=${ticketCount};

  // Return the unique URL
  res.json({ url: uniqueLink });
});

// Route to fetch available tickets (either from session or from database)
// Assuming you are using MySQL or any database to fetch available tickets
app.get('/api/tickets', async (req, res) => {
  try {
    // Fetch only tickets where 'available' is TRUE
    const [rows] = await db.query('SELECT * FROM tickets WHERE available = TRUE');
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No available tickets found' });
    }

    // Send available tickets as response
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route to reserve tickets
const Ticket = require('./server/models/Ticket'); // Ensure the correct path to your Ticket model file

// Reserve Tickets API
app.post('/api/tickets/reserve', async (req, res) => {
  const { ticketIds, firstName, lastName, email, phoneNumber } = req.body;

  try {
    // Retrieve tickets from the database
    const tickets = await Ticket.findAll({
      where: {
        ticketId: ticketIds,
      },
    });

    // Check if any tickets are already reserved
    const reservedTickets = tickets.filter((ticket) => !ticket.available);

    if (reservedTickets.length > 0) {
      return res.status(400).json({
        message: 'Some tickets are no longer available.',
        reservedTickets: reservedTickets.map((ticket) => ticket.ticketNumber),
      });
    }

    // Update tickets to mark them as reserved
    await Ticket.update(
      {
        available: false,
        name: ${firstName} ${lastName},
        email,
        phoneNumber,
        reservationDate: new Date(),
      },
      {
        where: {
          ticketId: ticketIds,
        },
      }
    );

    res.json({ message: 'Tickets reserved successfully!' });
  } catch (error) {
    console.error('Error reserving tickets:', error);
    res.status(500).json({ message: 'Error reserving tickets.' });
  }
});

// Validate Tickets API
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
    // Fetch tickets where 'available' is false (reserved tickets)
    const [rows] = await db.query('SELECT * FROM tickets WHERE available = FALSE');
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No reserved tickets found' });
    }

    // Send reserved tickets as response
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle 404 (Not Found) errors for undefined routes
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(Server running on port ${port});
});