import React, { useState } from 'react';
import axios from 'axios';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  const [feedback, setFeedback] = useState('');
  
  // Handle feedback submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedbackText = e.target[0].value; // Assuming the first input is the feedback

    try {
        const response = await axios.post('http://localhost:4000/api/feedback', { text: feedbackText }); // Change 'feedback' to 'text'
        // Handle response, e.g., show a success message
    } catch (error) {
        // Handle error
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
            Elevating your dining experience with every bite. Discover a world of flavors and indulge in our carefully curated menu, delivered straight to your door. Taste the difference with Street Food Station, where quality meets convenience.
          </p>
        </div>

        <div className="footer-contact">
          <h2>CONTACT US</h2>
          <ul>
            <li>+91 9313495425</li>
            <li>streetfoodstation.official@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr />
      <p className="footer-copyright">Copyright 2024 © Streetfoodstation.com - All rights reserved.</p>
    </div>
  );
};

export default Footer;
