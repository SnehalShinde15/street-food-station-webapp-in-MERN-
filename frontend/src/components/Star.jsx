// src/components/Star.js
import React from 'react';

const Star = ({ type, color }) => {
  const starType = {
    full: '★',
    half: '⯨',
    empty: '☆'
  };

  const starColor = type === 'empty' ? 'grey' : color;

  return <span style={{ color: starColor }}>{starType[type]}</span>;
};

export default Star;
