
import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12", light = false }) => {
  const brandColor = light ? "white" : "#1d4ed8"; // Royal Blue from image
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Transcity Stylized Box Logo */}
      <div className="shrink-0">
        <svg viewBox="0 0 100 100" className="h-10 w-10">
          <rect width="100" height="100" rx="10" fill={brandColor} />
          {/* Stylized White Mark (Simplified version of the image's T/7 mark) */}
          <path 
            d="M20 30 H80 L40 85 L25 85 L55 38 H20 Z" 
            fill={light ? "#1d4ed8" : "white"} 
          />
        </svg>
      </div>
      
      <div className="flex flex-col justify-center">
        <span className={`text-2xl font-bold tracking-tight leading-none ${light ? 'text-white' : 'text-blue-700'}`}>
          Transcity<span className="text-sm align-top">®</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
