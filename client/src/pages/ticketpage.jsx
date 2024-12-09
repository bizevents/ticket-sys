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

    try {
      const response = await axios.post(
        "https://ticket-sys-server.vercel.app/api/tickets/reserve",
        {
          ticketIds: selectedTickets,
          ...formData,
        }
      );

      // Once the tickets are reserved, we query for reserved tickets
      const reservedResponse = await axios.get("https://ticket-sys-server.vercel.app/api/tickets/reserved");

      // Redirect to the TicketGenerated page with reserved tickets
      navigate("/ticket-generated", {
        state: {
          firstName: formData.firstName,
          reservedTicketNumbers: reservedResponse.data.map(ticket => ticket.ticket_number),
        },
      });

      setSelectedTickets([]);
      setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "" });
      setErrorMessage("");
    } catch (error) {
      console.error("Error reserving tickets:", error);
      setErrorMessage("An error occurred while reserving tickets.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        <button onClick={handleFormSubmit} disabled={selectedTickets.length === 0}>
          Reserve Tickets
        </button>
      </div>

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
  );
};

export default TicketGrid;