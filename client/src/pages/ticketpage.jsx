import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./ticketgrid.css";

const TicketGrid = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [ticketCount, setTicketCount] = useState(0); // Default value for ticketCount
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);

  // Access ticketCount from URL state (from TicketSystem component)
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.ticketCount) {
      setTicketCount(location.state.ticketCount); // Set ticketCount from state
    }
  }, [location.state]);

  useEffect(() => {
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
        setErrorMessage(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

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
      alert("Tickets reserved successfully!");
      setSelectedTickets([]);
      setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "" });
      setErrorMessage("");
      setShowModal(false);
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
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
            <p>Ticket #{ticket.ticketNumber}</p>
            <p>{ticket.available ? "Available" : "Reserved"}</p>
          </div>
        ))}
      </div>
      <div className="actions">
        <p>Selected Tickets: {selectedTickets.length}/{ticketCount}</p>
        <button onClick={() => setShowModal(true)} disabled={selectedTickets.length === 0}>
          Reserve Tickets
        </button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reserve Tickets</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketGrid;
