import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ProgressBar } from '../../common';
import { cn } from '../../../../utils/cn';
import type { AccountProgressProps } from '../../../pages/mypage/types/mypageTypes';

const AccountProgress: React.FC<AccountProgressProps> = ({
  progress,
  items,
  className
}) => {
  const getColorClass = (color: 'green' | 'yellow' | 'red') => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>계정 완성도</CardTitle>
        <CardDescription>프로필 완성도를 높여 더 나은 서비스를 이용하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ProgressBar value={progress} showLabel variant="success" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <div className={cn("w-2 h-2 rounded-full", getColorClass(item.color))}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountProgress; 