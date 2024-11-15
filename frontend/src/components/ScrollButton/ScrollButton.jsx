// ScrollToTopButton.js
import React, { useState, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import './ScrollButton.css'; // Ensure the path is correct

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinate to 0 and use smooth scrolling with react-scroll
  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`scroll-button ${isVisible ? 'visible' : 'hidden'}`}>
      {isVisible && (
        <button className="scroll-to-top" onClick={scrollToTop}>
            ↑ {/* Up arrow icon */}
        </button>
      )}
    </div>
  );
};

export default ScrollButton;
