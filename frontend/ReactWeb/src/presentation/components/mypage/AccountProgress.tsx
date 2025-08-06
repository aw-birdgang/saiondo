import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ProgressBar,
} from '@/presentation/components/common';
import { cn } from '@/utils/cn';
import type { AccountProgressProps } from '@/presentation/pages/mypage/types/mypageTypes';

// Import separated components
import ProgressCircle from '@/presentation/components/mypage/components/ProgressCircle';
import ProgressItem from '@/presentation/components/mypage/components/ProgressItem';
import ProgressCompletionMessage from '@/presentation/components/mypage/components/ProgressCompletionMessage';
import { getProgressColor } from '@/presentation/components/mypage/utils/progressUtils';

const AccountProgress: React.FC<AccountProgressProps> = ({
  progress,
  items,
  className,
}) => {
  return (
    <Card
      className={cn(
        'transition-all duration-300 hover:shadow-lg',
        'border-l-4 border-l-orange-500',
        'bg-white dark:bg-gray-800',
        className
      )}
    >
      <CardHeader className='pb-4'>
        <CardTitle className='text-xl font-bold text-gray-900 dark:text-white'>
          계정 완성도
        </CardTitle>
        <CardDescription className='text-gray-600 dark:text-gray-300'>
          프로필 완성도를 높여 더 나은 서비스를 이용하세요
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='space-y-6'>
          <div className='text-center'>
            <ProgressCircle progress={progress} />
          </div>

          <ProgressBar
            value={progress}
            showLabel
            variant={getProgressColor(progress)}
            className='h-3'
          />

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {items.map((item, index) => (
              <ProgressItem
                key={item.id}
                id={item.id}
                label={item.label}
                color={item.color}
                index={index}
              />
            ))}
          </div>

          <ProgressCompletionMessage progress={progress} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountProgress;
