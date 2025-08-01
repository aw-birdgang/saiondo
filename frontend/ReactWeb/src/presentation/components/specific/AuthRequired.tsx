import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface AuthRequiredProps {
  loginRoute: string;
  className?: string;
}

const AuthRequired: React.FC<AuthRequiredProps> = ({ 
  loginRoute, 
  className = "" 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{t("auth.login_required")}</h2>
        <button
          onClick={() => navigate(loginRoute)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t("auth.login")}
        </button>
      </div>
    </div>
  );
};

export default AuthRequired; 