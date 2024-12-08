import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './ticketgrid.css';

const TicketGrid = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [invalidSession, setInvalidSession] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('sessionId');
    const count = parseInt(queryParams.get('ticketCount'), 10) || 0;

    if (!sessionId || count <= 0) {
      setInvalidSession(true);
      setLoading(false);
      return;
    }

    setTicketCount(count);

    const url = `https://ticket-sys-server.vercel.app/api/Tickets?sessionId=${sessionId}`;
    console.log('Fetching tickets from:', url);

    axios
      .get(url)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTickets(response.data);
        } else {
          console.error('Invalid data format:', response.data);
          setErrorMessage('Invalid data format received from server.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('API request error:', error.message);
        if (error.response && error.response.status === 404) {
          setErrorMessage('This link is invalid or has expired.');
        } else {
          setErrorMessage('Error fetching available tickets. Please try again.');
        }
        setInvalidSession(true);
        setLoading(false);
      });
  }, [location.search]);

  const handleSelectTicket = (ticketId) => {
    if (selectedTickets.includes(ticketId)) {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
    } else if (selectedTickets.length < ticketCount) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setErrorMessage(`You can only select ${ticketCount} tickets.`);
    }
  };

  const getSelectedTicketNumbers = () => {
    return selectedTickets
      .map((ticketId) => {
        const ticket = tickets.find((ticket) => ticket.ticketId === ticketId);
        return ticket ? ticket.ticketNumber : null;
      })
      .filter((ticketNumber) => ticketNumber !== null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://ticket-sys-server.vercel.app/api/Tickets/reserve', {
        ticketIds: selectedTickets,
        ...formData,
      });

      alert('Tickets reserved successfully!');
      setSelectedTickets([]);
      setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '' });
      setErrorMessage('');
      setShowModal(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { reservedTickets } = error.response.data;
        setErrorMessage(
          `The following tickets have just been reserved by another user: ${reservedTickets.join(
            ', '
          )}. Please select different tickets.`
        );

        setSelectedTickets((prevSelected) =>
          prevSelected.filter(
            (ticketId) =>
              !reservedTickets.some(
                (ticketNumber) =>
                  tickets.find((ticket) => ticket.ticketId === ticketId)?.ticketNumber === ticketNumber
              )
          )
        );
      } else {
        console.error('Error reserving tickets:', error);
        setErrorMessage('An unexpected error occurred. Please try again.');
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

  if (invalidSession) {
    return <div>{errorMessage || 'This link is invalid or has expired.'}</div>;
  }

  return (
    <div className="ticket-grid">
      <h1>Available Tickets</h1>
      <div className="tickets">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticketId}
            className={`ticket ${selectedTickets.includes(ticket.ticketId) ? 'selected' : ''}`}
            onClick={() => handleSelectTicket(ticket.ticketId)}
          >
            <p>Ticket #{ticket.ticketNumber}</p>
            <p>{ticket.available ? 'Available' : 'Reserved'}</p>
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
