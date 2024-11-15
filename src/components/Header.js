import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-indigo-600 text-white py-4 shadow-md">
      
      

      <nav className="mt-4 text-center">
        <Link to="/" className="text-white px-4 py-2 hover:bg-indigo-700 rounded">Home</Link>
        <Link to="/admin-dashboard" className="text-white px-4 py-2 hover:bg-indigo-700 rounded">Admin Dashboard</Link>
       
      </nav>
    </header>
  );
}

export default Header;
