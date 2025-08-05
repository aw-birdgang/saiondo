import React from 'react';
import { QuickActionButton } from '../common';

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
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${className}`}>
      {actions.map((action, index) => (
        <QuickActionButton
          key={index}
          label={action.label}
          onClick={action.onClick}
        />
      ))}
    </div>
  );
};

export default QuickActionsGrid;
