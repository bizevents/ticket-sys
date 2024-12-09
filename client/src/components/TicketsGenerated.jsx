import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';

const TicketGenerated = () => {
  const { state } = useLocation();
  const { firstName, tickets } = state || {}; // Destructure name and tickets from the passed state
  const ticketRef = useRef();

  useEffect(() => {
    // Generate the ticket image once the tickets are displayed
    if (tickets && ticketRef.current) {
      html2canvas(ticketRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const downloadButton = document.getElementById('download-btn');
        downloadButton.href = imgData; // Set the download link to the generated image
      });
    }
  }, [tickets]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'tickets.png';
    link.href = ticketRef.current?.toDataURL();
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Hello, {firstName}!</h2>
      <p>Please download or screenshot your ticket to avoid losing it.</p>

      {/* Display the tickets inside an html2canvas div */}
      <div
        ref={ticketRef}
        style={{
          display: 'inline-block',
          padding: '20px',
          border: '2px solid #000',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          marginTop: '20px',
        }}
      >
        <h3>Your Tickets</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tickets?.map((ticket, index) => (
            <div
              key={index}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#fff',
              }}
            >
              {ticket}
            </div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <button
        id="download-btn"
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
        }}
        onClick={handleDownload}
      >
        Download Tickets
      </button>
    </div>
  );
};

export default TicketGenerated;
