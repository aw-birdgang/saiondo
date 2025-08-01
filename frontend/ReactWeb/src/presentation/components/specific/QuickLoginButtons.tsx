import React from "react";
import { useTranslation } from "react-i18next";
import { QuickLoginButton } from "../common";

interface QuickLoginButtonsProps {
  onQuickLogin: (email: string) => void;
  loading?: boolean;
  className?: string;
}

const QuickLoginButtons: React.FC<QuickLoginButtonsProps> = ({ 
  onQuickLogin, 
  loading = false, 
  className = "" 
}) => {
  const { t } = useTranslation();

  const handleQuickLogin = (email: string) => {
    onQuickLogin(email);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <QuickLoginButton
        email="kim@example.com"
        label={t('quick_login_kim')}
        onClick={handleQuickLogin}
        loading={loading}
      />
      <QuickLoginButton
        email="lee@example.com"
        label={t('quick_login_lee')}
        onClick={handleQuickLogin}
        loading={loading}
      />
    </div>
  );
};

export default QuickLoginButtons; 