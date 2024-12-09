import { useLocation } from "react-router-dom";
import { useRef } from "react";
import './ticketgenerated.css';

const TicketGenerated = () => {
  const location = useLocation();
  const { firstName, reservedTicketNumbers } = location.state || {};
  
  // Canvas ref for image generation
  const canvasRef = useRef(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Set up canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Set background color and text styling
    ctx.fillStyle = "#f4f4f9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    ctx.fillStyle = "#34495e";

    // Title
    ctx.fillText(`Reserved Tickets for ${firstName}`, 20, 40);

    // List tickets
    let yPosition = 80;
    reservedTicketNumbers.forEach(ticket => {
      ctx.fillText(`Ticket #${ticket}`, 20, yPosition);
      yPosition += 40;
    });

    // Convert canvas to PNG and download
    const imageUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "reserved-tickets.png";
    link.click();
  };

  return (
    <div className="ticket-generated-container">
      <div className="ticket-header">
        <h1>Tickets Reserved</h1>
        <p className="thank-you-message">Thank you for reserving, {firstName}!</p>
      </div>
      <div className="ticket-list">
        <p className="reserved-tickets-header">Your Reserved Tickets:</p>
        <ul className="ticket-numbers">
          {reservedTicketNumbers.map((ticket, index) => (
            <li key={index} className="ticket-item">Ticket #{ticket}</li>
          ))}
        </ul>
      </div>
      <button className="download-button" onClick={handleDownload}>Download Tickets as PNG</button>

      {/* Hidden canvas element */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default TicketGenerated;
