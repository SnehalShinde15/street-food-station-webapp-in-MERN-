import React, { useState, useContext } from 'react';
import axios from 'axios';
import './Footer.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const Footer = () => {
  const [feedback, setFeedback] = useState('');
  const { url } = useContext(StoreContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    try {
      const response = await axios.post(`${url}/api/feedback`, { text: feedback });
      if (response.data.success) {
        toast.success('Thank you for your feedback!');
        setFeedback(''); // Clear the input after successful submission
      } else {
        toast.error('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('Failed to submit feedback. Please try again later.');
    }
  };

  return (
    <div className='footer' id='footer'>
      <div className="footer-feedback">
        <h2>Got a Minute? We Want Your Feedback!</h2>
        <form className="feedback-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter your feedback here*" 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required 
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="footer-bottom">
        <div className="footer-about">
          <h2>ABOUT US</h2>
          <p>
            Elevating your dining experience with every bite. Discover a world of flavors and indulge in our carefully curated menu, delivered straight to your door. Taste the difference with DineSwift, where quality meets convenience.
          </p>
        </div>

        <div className="footer-contact">
          <h2>CONTACT US</h2>
          <ul>
            <li>+91 8446168109</li>
            <li>snehal05shinde@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr />
      <p className="footer-copyright">Copyright 2024 © DineSwift.com - All rights reserved.</p>
    </div>
  );
};

export default Footer;
