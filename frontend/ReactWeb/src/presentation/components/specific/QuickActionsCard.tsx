import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../shared/constants/app";
import { Card, QuickActionButton } from "../common";

interface QuickActionsCardProps {
  className?: string;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <Card title={t("home.quick_actions")} className={className}>
      <div className="space-y-3">
        <QuickActionButton
          label={t("nav.chat")}
          variant="primary"
          onClick={() => handleNavigate(ROUTES.CHAT)}
        />
        <QuickActionButton
          label={t("nav.channels")}
          variant="success"
          onClick={() => handleNavigate(ROUTES.CHANNELS)}
        />
        <QuickActionButton
          label={t("nav.profile")}
          variant="secondary"
          onClick={() => handleNavigate(ROUTES.PROFILE)}
        />
      </div>
    </Card>
  );
};

export default QuickActionsCard; 