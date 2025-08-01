import React from "react";

interface GradientBackgroundProps {
  children: React.ReactNode;
  gradient?: string;
  className?: string;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  children, 
  gradient = "bg-gradient-to-br from-blue-500 to-purple-600", 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen ${gradient} ${className}`}>
      {children}
    </div>
  );
};

export default GradientBackground; 