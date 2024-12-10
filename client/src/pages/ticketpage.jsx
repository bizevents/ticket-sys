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
  
    if (!formData.firstName || !formData.phoneNumber) {
      setErrorMessage("Please fill out the name and phone number fields.");
      return;
    }
  
    try {
      // Reserve tickets
      await axios.post(
        "https://ticket-sys-server.vercel.app/api/tickets/reserve",
        {
          ticketIds: selectedTickets,
          name: `${formData.firstName} ${formData.lastName}`,
          phone_number: formData.phoneNumber,
          email: formData.email,
        }
      );
  
      // Fetch the user's reserved tickets
      const reservedResponse = await axios.post(
        "https://ticket-sys-server.vercel.app/api/tickets/reserving",
        {
          name: `${formData.firstName} ${formData.lastName}`,
          phoneNumber: formData.phoneNumber,
        }
      );
  
      // Redirect to TicketGenerated page
      navigate("/ticket-generated", {
        state: {
          firstName: formData.firstName,
          reservedTicketNumbers: reservedResponse.data.map(ticket => ticket.ticket_number),
        },
      });
  
      // Reset state
      setSelectedTickets([]);
      setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "" });
      setErrorMessage("");
      setIsModalOpen(false);
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
