
import React from 'react';

const GridBackground: React.FC = () => {
  return (
    <div className="grid-container">
      <div className="grid"></div>
      {/* Distant Sun / Horizon effect */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-pink-500 via-transparent to-transparent opacity-20 blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default GridBackground;
