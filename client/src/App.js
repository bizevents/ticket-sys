import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TicketGrid from './pages/ticketpage';
import TicketSystem from './components/ticket-system';
import ReservedTickets from './components/Reservedtickets';
import TicketGenerated from './components/TicketsGenerated';
import ProtectedRoute from './ProtectedRoutes';  // Import the ProtectedRoute component
import LoginPage from './components/Login'; // Import LoginPage

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route for the login page */}
        <Route path="/login" element={<LoginPage />} />
    
        <Route 
          path="/" 
          element={<ProtectedRoute element={<TicketSystem />} />} 
        />
        
        {/* Protected route for the reserved tickets */}
        <Route 
          path="/reserved" 
          element={<ProtectedRoute element={<ReservedTickets />} />} 
        />
        
        {/* Public route for the ticket grid */}
        <Route path="/tickets" element={<TicketGrid />} />
        
        {/* Public route for the ticket generated page */}
        <Route path='/ticket-generated' element={<TicketGenerated />} />
      </Routes>
    </Router>
  );
};

export default App;
