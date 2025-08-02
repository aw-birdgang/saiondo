import React from "react";
import QuickActionButton from "./QuickActionButton";

interface QuickAction {
  icon: string;
  label: string;
  onClick: () => void;
  description?: string;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
  className?: string;
}

const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ 
  actions, 
  className = "" 
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${className}`}>
      {actions.map((action, index) => (
        <QuickActionButton
          key={index}
          icon={action.icon}
          label={action.label}
          description={action.description}
          onClick={action.onClick}
        />
      ))}
    </div>
  );
};

export default QuickActionsGrid; 