import React from 'react';
import { Button } from '@/presentation/components/common/index';

interface QuickActionButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  onClick: () => void;
  className?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  variant = 'primary',
  onClick,
  className = '',
}) => {
  return (
    <Button variant={variant === 'danger' ? 'destructive' : variant} fullWidth onClick={onClick} className={className}>
      {label}
    </Button>
  );
};

export default QuickActionButton;
