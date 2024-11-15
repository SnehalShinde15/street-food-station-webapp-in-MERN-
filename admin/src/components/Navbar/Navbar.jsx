import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { assets } from '../../assets/assets';

const Navbar = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false); // State to manage logout button visibility

  const handleLogout = () => {
    // Logic for logging out the user (e.g., clearing tokens)
    alert("Logged out!");
    navigate('/admin/login'); // Redirect to login page
  };

  const toggleLogout = () => {
    setShowLogout(prevState => !prevState); // Toggle the logout button visibility
  };

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="logo" />
      <div className='navbar-profile'>
        <img 
          className='profile' 
          src={assets.profile_image} 
          alt="profile" 
          onClick={toggleLogout} // Toggle logout button visibility on profile image click
        />
        {showLogout && (
          <button className='logout-button' onClick={handleLogout}>Logout</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;