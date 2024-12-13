import { useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import './ticketgenerated.css';

const TicketGenerated = () => {
  const location = useLocation();
  const { firstName, reservedTicketNumbers, phoneNumber } = location.state || {};

  // Canvas ref for image generation
  const canvasRef = useRef(null);

  // State for SMS status and loading
  const [smsStatus, setSmsStatus] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSendSms = async () => {
    if (!phoneNumber) {
      setSmsStatus("Phone number is missing. Cannot send SMS.");
      return;
    }

    setLoading(true);
    setSmsStatus("");

    try {
      const response = await axios.post("https://https://ticket-sys-server.vercel.app/api/tickets/send-sms", {
        phoneNumber,
        message: `Hello ${firstName}, your reserved tickets: ${reservedTicketNumbers.join(", ")}`
      });

      if (response.data.success) {
        setSmsStatus("SMS sent successfully!");
      } else {
        setSmsStatus("Failed to send SMS. Please try again.");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      setSmsStatus("An error occurred while sending the SMS.");
    } finally {
      setLoading(false);
    }
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

      <div className="button-group">
        <button className="download-button" onClick={handleDownload}>Download Tickets as PNG</button>
        <button className="sms-button" onClick={handleSendSms} disabled={loading}>
          {loading ? "Sending SMS..." : "Send Tickets via SMS"}
        </button>
      </div>

      {smsStatus && <p className="sms-status">{smsStatus}</p>}

      {/* Hidden canvas element */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default TicketGenerated;
