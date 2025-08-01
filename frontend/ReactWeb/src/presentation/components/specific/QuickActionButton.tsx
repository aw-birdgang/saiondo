import React from "react";

interface QuickActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  className?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-white dark:bg-dark-secondary-container p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="text-center">
        <span className="text-2xl mb-2 block">{icon}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      </div>
    </button>
  );
};

export default QuickActionButton; 