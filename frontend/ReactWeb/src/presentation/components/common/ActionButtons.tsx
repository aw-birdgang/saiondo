import React from 'react';
import { ActionButton } from './index';

interface ActionButtonsProps {
  actions: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  actions,
  className = '',
}) => {
  return (
    <div className={`flex justify-center space-x-4 ${className}`}>
      {actions.map((action, index) => (
        <ActionButton
          key={index}
          onClick={action.onClick}
          variant={action.variant || 'primary'}
        >
          {action.label}
        </ActionButton>
      ))}
    </div>
  );
};

export default ActionButtons;
