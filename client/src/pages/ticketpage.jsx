import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import './ticketgrid.css';

const TicketGrid = () => {
  const navigate = useNavigate(); // Hook to handle redirection
  const location = useLocation(); // Hook to access the URL and parameters

  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [ticketCount, setTicketCount] = useState(5); // Default value if no count in URL
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);

  // Extract ticketCount from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const count = params.get('ticketCount');
    if (count) {
      setTicketCount(Number(count)); // Update ticket count from URL query parameter
    }

    const fetchTickets = async () => {
      try {
        const response = await axios.get("https://ticket-sys-server.vercel.app/api/tickets");

        // Log the response data to inspect the structure
        console.log("API Response Data:", response.data);

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
  }, [location.search]); // Dependency on location.search to re-fetch when URL changes

  const handleSelectTicket = (ticketId) => {
    if (selectedTickets.includes(ticketId)) {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
    } else if (selectedTickets.length < ticketCount) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setErrorMessage(`You can only select up to ${ticketCount} tickets.`);
    }
  };

  const getSelectedTicketNumbers = () => {
    return selectedTickets
      .map((ticketId) => {
        const ticket = tickets.find((ticket) => ticket.ticketId === ticketId);
        return ticket ? ticket.ticket_number : null;
      })
      .filter((ticketNumber) => ticketNumber !== null);
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

      // Redirect to the ticket generated page with form data and selected tickets
      navigate("/ticket-generated", {
        state: {
          firstName: formData.firstName,
          selectedTickets: getSelectedTicketNumbers(),
        },
      });

      setSelectedTickets([]);
      setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "" });
      setErrorMessage("");
      setShowModal(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { reservedTickets } = error.response.data;
        setErrorMessage(
          `The following tickets have just been reserved by another user: ${reservedTickets.join(
            ", "
          )}. Please select different tickets.`
        );

        setSelectedTickets((prevSelected) =>
          prevSelected.filter(
            (ticketId) =>
              !reservedTickets.some(
                (ticketNumber) =>
                  tickets.find((ticket) => ticket.ticketId === ticketId)
                    ?.ticket_number === ticketNumber
              )
          )
        );
      } else {
        console.error("Error reserving tickets:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
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
        <p>
          Selected Tickets: {selectedTickets.length}/{ticketCount}
        </p>
        <ul>
          {getSelectedTicketNumbers().map((ticketNumber, index) => (
            <li key={index}>Ticket #{ticketNumber}</li>
          ))}
        </ul>
        <button onClick={() => setShowModal(true)} disabled={selectedTickets.length === 0}>
          Reserve Tickets
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reserve Tickets</h2>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

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
              <div className="modal-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketGrid;