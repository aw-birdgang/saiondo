import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../common";
import { cn } from "../../../utils/cn";
import { QUICK_LOGIN_ACCOUNTS } from "../../pages/auth/constants/authData";
import type { QuickLoginButtonsProps } from "../../pages/auth/types/authTypes";

const QuickLoginButtons: React.FC<QuickLoginButtonsProps> = ({ 
  onQuickLogin, 
  loading = false, 
  className = "" 
}) => {
  const { t } = useTranslation();

  const handleQuickLogin = async (email: string) => {
    try {
      await onQuickLogin(email);
    } catch (error) {
      console.error('Quick login error:', error);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="text-center">
        <p className="text-sm text-txt-secondary mb-4">
          {t('auth.quick_login_description') || '테스트 계정으로 빠르게 로그인'}
        </p>
      </div>
      
      {QUICK_LOGIN_ACCOUNTS.map((account) => (
        <Button
          key={account.email}
          variant="outline"
          fullWidth
          onClick={() => handleQuickLogin(account.email)}
          disabled={loading}
          leftIcon="🚀"
        >
          <div className="text-left">
            <div className="font-medium">{account.label}</div>
            <div className="text-xs text-txt-secondary">{account.description}</div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickLoginButtons; 