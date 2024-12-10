import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import './ticketgrid.css';

const TicketGrid = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [ticketCount, setTicketCount] = useState(5); // Default value if no count in URL
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const count = params.get('ticketCount');
    if (count) {
      setTicketCount(Number(count));
    }

    const fetchTickets = async () => {
      try {
        const response = await axios.get("https://ticket-sys-server.vercel.app/api/tickets");

        if (response.data.message) {
          setErrorMessage(response.data.message);
        } else if (Array.isArray(response.data)) {
          setTickets(response.data);
        } else {
          setErrorMessage("Invalid data format received from server.");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setErrorMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [location.search]);

  const handleSelectTicket = (ticketId) => {
    if (selectedTickets.includes(ticketId)) {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
    } else if (selectedTickets.length < ticketCount) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setErrorMessage(`You can only select up to ${ticketCount} tickets.`);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
      setErrorMessage("Please fill out all the fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://ticket-sys-server.vercel.app/api/tickets/reserve",
        {
          ticketIds: selectedTickets,
          ...formData,
        }
      );

      // Once the tickets are reserved, we query for reserved tickets
      /**
 * Fetch reserved tickets based on customer details
 */
app.get('/api/tickets/reserving', async (req, res) => {
  const { firstName, phoneNumber } = req.query; // Extract user details from query parameters

  if (!firstName || !phoneNumber) {
    return res.status(400).json({ message: 'Name and phone number are required.' });
  }

  try {
    // Query the database for tickets reserved by the user
    const reservedTickets = await Ticket.findAll({
      where: {
        name: { [Op.eq]: firstName },
        phone_number: { [Op.eq]: phoneNumber },
        available: false, // Reserved tickets
      },
    });

    if (reservedTickets.length === 0) {
      return res.status(404).json({ message: 'No reserved tickets found for the provided details.' });
    }

    res.json(reservedTickets); // Return reserved tickets to the front end
  } catch (err) {
    console.error('Error fetching reserved tickets:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});


      setSelectedTickets([]);
      setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "" });
      setErrorMessage("");
      setIsModalOpen(false); // Close the modal after successful reservation
    } catch (error) {
      console.error("Error reserving tickets:", error);
      setErrorMessage("An error occurred while reserving tickets.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = () => {
    setIsModalOpen(true); // Open the modal when needed
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ticket-grid">
      <h1>Available Tickets</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="tickets">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticketId}
            className={`ticket ${selectedTickets.includes(ticket.ticketId) ? "selected" : ""}`}
            onClick={() => handleSelectTicket(ticket.ticketId)}
          >
            <p>Ticket #{ticket.ticket_number}</p>
            <p>{ticket.available ? "Available" : "Reserved"}</p>
          </div>
        ))}
      </div>

      <div className="actions">
        <p>Selected Tickets: {selectedTickets.length}/{ticketCount}</p>
        <button onClick={openModal} disabled={selectedTickets.length === 0}>
          Reserve Tickets
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-modal" onClick={closeModal}>X</button>
            <h2>Reserve Your Tickets</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketGrid;
