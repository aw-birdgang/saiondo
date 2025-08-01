import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './index';

interface QuickLoginButtonProps {
  email: string;
  label: string;
  onClick: (email: string) => void;
  loading?: boolean;
  className?: string;
}

const QuickLoginButton: React.FC<QuickLoginButtonProps> = ({
  email,
  label,
  onClick,
  loading = false,
  className = '',
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    onClick(email);
  };

  return (
    <Button
      variant="secondary"
      fullWidth
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {label}
    </Button>
  );
};

export default QuickLoginButton; 