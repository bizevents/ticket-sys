import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReservedTickets = () => {
  const [reservedTickets, setReservedTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the reserved tickets from the backend
    axios.get('https://ticket-sys-server.vercel.app/api/tickets/reserved')
      .then((response) => {
        // Log the API response data to the console
        console.log('API Response:', response.data);

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
                <p>Ticket #{ticket.ticket_number}</p> {/* Correct field name */}
                <p>Reserved by: {ticket.name}</p>
                <p>Email: {ticket.email}</p>
                <p>Phone: {ticket.phone_number}</p> {/* Correct field name */}
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
