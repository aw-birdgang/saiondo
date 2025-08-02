import React from "react";

interface QuickActionButtonProps {
  icon: string;
  label: string;
  description?: string;
  onClick: () => void;
  className?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  icon, 
  label, 
  description,
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`card p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer ${className}`}
    >
      <div className="text-center">
        <span className="text-3xl mb-4 block">{icon}</span>
        <h3 className="text-sm font-semibold text-txt mb-2 leading-tight">
          {label}
        </h3>
        {description && (
          <p className="text-xs text-txt-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </button>
  );
};

export default QuickActionButton; 