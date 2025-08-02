import React from 'react';

interface QuickLoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const QuickLoginButton: React.FC<QuickLoginButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
        ${className}
      `}
    >
      Quick Login
    </button>
  );
};

export default QuickLoginButton; 