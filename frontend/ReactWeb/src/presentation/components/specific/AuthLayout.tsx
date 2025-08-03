import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div 
      className={`min-h-screen flex items-center justify-center py-12 px-6 sm:px-8 lg:px-10 transition-colors duration-300 ${className}`}
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {children}
    </div>
  );
};

export default AuthLayout; 