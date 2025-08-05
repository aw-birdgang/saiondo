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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'warning';
    return 'danger';
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      "border-l-4 border-l-orange-500",
      "bg-white dark:bg-gray-800",
      className
    )}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
          계정 완성도
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          프로필 완성도를 높여 더 나은 서비스를 이용하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progress}%
                </span>
              </div>
              <div 
                className="absolute inset-0 w-24 h-24 rounded-full border-8 border-transparent"
                style={{
                  background: `conic-gradient(${getProgressColor(progress) === 'success' ? '#10b981' : getProgressColor(progress) === 'warning' ? '#f59e0b' : '#ef4444'} ${progress * 3.6}deg, transparent 0deg)`
                }}
              />
            </div>
          </div>
          
          <ProgressBar 
            value={progress} 
            showLabel 
            variant={getProgressColor(progress) as any}
            className="h-3"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg",
                  "transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700",
                  "border border-gray-100 dark:border-gray-600"
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className={cn(
                  "w-3 h-3 rounded-full flex-shrink-0",
                  getColorClass(item.color)
                )} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          
          {progress < 100 && (
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                프로필을 완성하면 더 많은 기능을 이용할 수 있습니다! 🚀
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountProgress; 