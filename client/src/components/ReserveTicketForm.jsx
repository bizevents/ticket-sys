import React, { useState } from 'react';
import axios from 'axios';

const ReserveTicketForm = ({ ticket, onReservationSuccess }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !phoneNumber || !email) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError('');

    // Send reservation request to backend
    axios
      .post('http://localhost:5000/api/tickets/reserve', {
        ticketIds: [ticket.ticketId],
        name,
        phoneNumber,
        email,
      })
      .then((response) => {
        // Handle successful reservation
        onReservationSuccess(ticket.ticketId);
        alert('Ticket reserved successfully!');
      })
      .catch((error) => {
        console.error('Error reserving ticket:', error);
        setError('An error occurred while reserving the ticket.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="reservation-form">
      <h2>Reserve Ticket #{ticket.ticketNumber}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Reserving...' : 'Reserve Ticket'}
        </button>
      </form>
    </div>
  );
};

export default ReserveTicketForm;
