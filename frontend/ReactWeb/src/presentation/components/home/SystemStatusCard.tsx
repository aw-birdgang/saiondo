import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemStatItem } from '@/presentation/components/common';

const SystemStatusCard: React.FC = () => {
  const { t } = useTranslation();

  const systemStats = [
    {
      title: '시스템 상태',
      value: '정상',
      icon: '🟢',
      description: '모든 서비스가 정상적으로 작동 중입니다',
      variant: 'success' as const,
    },
    {
      title: '응답 시간',
      value: '120ms',
      icon: '⚡',
      description: '평균 응답 시간',
      variant: 'info' as const,
    },
    {
      title: '활성 사용자',
      value: '1,234',
      icon: '👥',
      description: '현재 접속 중인 사용자',
      variant: 'default' as const,
    },
  ];

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-bold text-txt leading-tight'>
        {t('system_status') || '시스템 상태'}
      </h3>

      <div className='grid grid-cols-1 gap-6'>
        {systemStats.map((stat, index) => (
          <SystemStatItem
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            variant={stat.variant}
          />
        ))}
      </div>
    </div>
  );
};

export default SystemStatusCard;
