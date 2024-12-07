import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservedTickets = () => {
  const [reservedTickets, setReservedTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the reserved tickets from the backend
    axios.get('http://localhost:5000/api/tickets/reserved')
      .then((response) => {
        setReservedTickets(response.data);  // Directly set the response data
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching reserved tickets:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Reserved Tickets</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="reserved-tickets-list">
          {reservedTickets.length > 0 ? (
            reservedTickets.map((ticket) => (
              <div key={ticket.ticketId} className="ticket">
                <p>Ticket #{ticket.ticketNumber}</p>
                <p>Reserved by: {ticket.name}</p>
                <p>Email: {ticket.email}</p>
                <p>Phone: {ticket.phoneNumber}</p>
                <p>Reservation Date: {ticket.reservationDate}</p>
              </div>
            ))
          ) : (
            <p>No reserved tickets.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservedTickets;
