import React from "react";
import { useTranslation } from "react-i18next";
import QuickActionButton from "./QuickActionButton";

interface QuickAction {
  icon: string;
  label: string;
  onClick: () => void;
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
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {actions.map((action, index) => (
        <QuickActionButton
          key={index}
          icon={action.icon}
          label={action.label}
          onClick={action.onClick}
        />
      ))}
    </div>
  );
};

export default QuickActionsGrid; 