import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, EmptyState } from '@/presentation/components/common';
import { cn } from '@/utils/cn';
import type { EmptyChannelStateProps } from '@/presentation/pages/channel/types/channelTypes';

const EmptyChannelState: React.FC<EmptyChannelStateProps> = ({
  onCreateChannel,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon='💬'
      title={t('channels.no_channels') || '채널이 없습니다'}
      description={
        t('channels.no_channels_description') || '첫 번째 채널을 만들어보세요!'
      }
      className={cn('', className)}
      action={
        <Button variant='primary' onClick={onCreateChannel} leftIcon='➕'>
          {t('channels.create_new_channel') || '새 채널 만들기'}
        </Button>
      }
    />
  );
};

export default EmptyChannelState;
