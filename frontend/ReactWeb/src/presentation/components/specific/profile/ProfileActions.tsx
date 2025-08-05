import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../common';

interface ProfileActionsProps {
  onEdit: () => void;
  onSettings: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  onEdit,
  onSettings
}) => {
  const { t } = useTranslation();

  const actions = [
    {
      label: t('edit_profile'),
      description: t('edit_profile_description'),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      ),
      onClick: onEdit,
      variant: 'primary' as const
    },
    {
      label: t('settings'),
      description: t('settings_description'),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      onClick: onSettings,
      variant: 'outline' as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('actions')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            onClick={action.onClick}
            className="w-full justify-start"
          >
            <span className="mr-3 text-gray-400">
              {action.icon}
            </span>
            <div className="text-left">
              <div className="font-medium">{action.label}</div>
              <div className="text-sm opacity-75">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProfileActions; 