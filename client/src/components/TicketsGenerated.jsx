import { useLocation } from "react-router-dom";

const TicketGenerated = () => {
  const location = useLocation();
  const { firstName, reservedTicketNumbers } = location.state || {};

  const handleDownload = () => {
    const blob = new Blob([reservedTicketNumbers.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reserved-tickets.txt";
    link.click();
  };

  return (
    <div>
      <h1>Tickets Reserved</h1>
      <p>Thank you for reserving, {firstName}!</p>
      <p>Reserved Tickets:</p>
      <ul>
        {reservedTicketNumbers.map((ticket, index) => (
          <li key={index}>Ticket #{ticket}</li>
        ))}
      </ul>
      <button onClick={handleDownload}>Download Ticket Numbers</button>
    </div>
  );
};

export default TicketGenerated;