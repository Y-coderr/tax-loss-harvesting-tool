import React from 'react';

const Loader = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-300'
  };
  
  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeClasses[size]} rounded-full border-2 border-t-transparent animate-spin ${colorClasses[color]}`}
      ></div>
    </div>
  );
};

export default Loader;