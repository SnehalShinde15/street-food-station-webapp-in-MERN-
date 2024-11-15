// src/components/Rating.js
import React from 'react';
import Star from './Star';

const Rating = ({ rating }) => {
  const color = rating >= 4 && rating < 5 ? 'tomato' : 'gold';

  const getStarType = (index) => {
    if (index < rating - 0.5) {
      return 'full';
    } else if (index < rating) {
      return 'half';
    } else {
      return 'empty';
    }
  };

  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <Star key={index} type={getStarType(index)} color={color} />
      ))}
    </div>
  );
};

export default Rating;
