import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import './Ticketsystem.css'; // Import the CSS file

const TicketSystem = () => {
  const [ticketCount, setTicketCount] = useState(0);
  const [uniqueLink, setUniqueLink] = useState('');

  const handleTicketCountChange = (event) => {
    setTicketCount(event.target.value);
  };

  const generateLink = () => {
    if (ticketCount <= 0) {
      alert('Please enter a valid ticket count.');
      return;
    }

    // Generate unique session link with ticketCount as a query parameter
    const url = `https://ticket-sys-client.vercel.app/Tickets`;

    // Set the URL to state or redirect to the new page
    setUniqueLink(url); // For QR code
  };

  return (
    <div className="ticket-system-container">
      <h1 className="header">BIZ BAZ RAFFLE </h1>
      <div className="form-container">
        <label htmlFor="ticketCount" className="label">
          Number of Tickets:
        </label>
        <input
          type="number"
          id="ticketCount"
          value={ticketCount}
          onChange={handleTicketCountChange}
          className="input"
        />
        <button onClick={generateLink} className="generate-button">
          Generate Session Link
        </button>
      </div>
      {uniqueLink && (
        <div className="qr-container" style={{display:'block'}}>
          <p className="qr-text">Here is your unique session QR Code:</p>
          <QRCodeCanvas value={uniqueLink} size={256} level="H" className="qr-code" />
          <button><Link to={uniqueLink}>continue here</Link></button>
        </div>
      )}
    </div>
  );
};

export default TicketSystem;
