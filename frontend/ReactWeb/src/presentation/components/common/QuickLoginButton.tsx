import React from 'react';

interface QuickLoginButtonProps {
  email: string;
  label: string;
  onClick: (email: string) => void;
  disabled?: boolean;
  className?: string;
}

export const QuickLoginButton: React.FC<QuickLoginButtonProps> = ({ 
  email,
  label,
  onClick, 
  disabled = false, 
  className = '' 
}) => {
  const handleClick = () => {
    onClick(email);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
        ${className}
      `}
    >
      {label}
    </button>
  );
};

export default QuickLoginButton; 