import React, { useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [ticketId, setTicketId] = useState("");
  const [ticketDetails, setTicketDetails] = useState(null);

  const handleSearchTicket = async () => {
    try {
      const response = await axios.get(`https://ticket-sys-server.vercel.app/ticket-details/${ticketId}`);
      setTicketDetails(response.data);
    } catch (error) {
      alert("Ticket not found");
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <input
        type="text"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        placeholder="Enter Ticket ID"
      />
      <button onClick={handleSearchTicket}>Search Ticket</button>

      {ticketDetails && (
        <div>
          <h2>Ticket Details</h2>
          <p><strong>Ticket ID:</strong> {ticketDetails.ticketId}</p>
          <p><strong>Name:</strong> {ticketDetails.userData.firstName} {ticketDetails.userData.lastName}</p>
          <p><strong>Email:</strong> {ticketDetails.userData.email}</p>
          <p><strong>Phone:</strong> {ticketDetails.userData.phoneNumber}</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
