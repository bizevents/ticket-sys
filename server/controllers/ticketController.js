const Ticket = require('../models/Ticket');  // Import the ticket model

// Handle ticket session creation
const createTicketSession = async (req, res) => {
  const { id } = req.params;  // Retrieve the unique session ID from the URL
  const ticketCount = req.query.tickets;  // Get ticket count from query parameters

  if (!ticketCount || isNaN(ticketCount)) {
    return res.status(400).json({ error: 'Invalid ticket count.' });
  }

  try {
    // Fetch available tickets or generate mock data
    const tickets = [];
    for (let i = 0; i < ticketCount; i++) {
      tickets.push({
        ticketNumber: `TICKET-${id}-${i + 1}`,
        available: true,
      });
    }

    // Send tickets as the response
    res.json({ tickets });

  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Error fetching tickets." });
  }
};

module.exports = { createTicketSession };
