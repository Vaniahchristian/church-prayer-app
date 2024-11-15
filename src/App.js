import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrayerForm from './components/PrayerForm';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header'; // Corrected import (capitalized 'Header')

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header /> {/* Use the Header component here */}

        <main className="flex-grow flex items-center justify-center w-full">
          <Routes>
            <Route path="/" element={<PrayerForm />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
    
            
            
            {/* Add other routes as needed */}
          </Routes>
        </main>

       
      </div>
    </Router>
  );
}

export default App;
