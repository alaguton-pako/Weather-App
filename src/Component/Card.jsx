import React from 'react';

const Card = ({ children, className, backgroundImage }) => {
  return (
    <div
      className={`my-20 max-w-[800px] mx-auto p-4 bg-gray-300 rounded-lg ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {children}
    </div>
  );
};

export default Card;
