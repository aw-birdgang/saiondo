import React from "react";

interface HomeLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 ${className}`}>
      {children}
    </div>
  );
};

export default HomeLayout; 