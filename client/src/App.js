import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TicketGrid from './pages/ticketpage';  // Import your TicketGrid component
import TicketSystem from './components/ticket-system';  // Import your TicketSystem component
import ReservedTickets from './components/Reservedtickets';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for generating the QR code */}
        <Route path="/" element={<TicketSystem />} />
        <Route path="/reserved" element={<ReservedTickets />} />

        {/* Route for the ticket grid with query parameters */}
        <Route path="/tickets" element={<TicketGrid />} />
      </Routes>
    </Router>
  );
};

export default App;

