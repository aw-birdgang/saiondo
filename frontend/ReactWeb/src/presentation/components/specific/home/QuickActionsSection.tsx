import React from 'react';
import { Card, CardContent, Badge, CounterBadge } from '../../common';
import { cn } from '../../../../utils/cn';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
  gradient?: boolean;
}

interface QuickActionsSectionProps {
  actions: QuickActionProps[];
  onActionClick: (action: QuickActionProps) => void;
  className?: string;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  href,
  color,
  badge,
  gradient = false
}) => (
  <Card
    variant={gradient ? "gradient" : "interactive"}
    hover="lift"
    className="cursor-pointer group relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:scale-105"
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transform rotate-12 scale-150"></div>
    </div>
    
    <CardContent className="relative p-6">
      <div className="flex items-start space-x-4">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative transition-all duration-300 shadow-lg",
          gradient 
            ? "bg-gradient-to-br from-red-500 to-red-600" 
            : "bg-gradient-to-br from-blue-500 to-blue-600",
          "group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3"
        )}>
          <div className="text-white text-xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          {badge && (
            <CounterBadge
              count={parseInt(badge)}
              className="absolute -top-2 -right-2 group-hover:scale-110 transition-transform duration-300 bg-red-500 text-white"
            />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center space-x-2 pt-2">
            <span className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200 font-medium">
              시작하기
            </span>
            <svg className="w-3 h-3 text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  actions,
  onActionClick,
  className
}) => {
  return (
    <div className={cn("animate-fade-in", className)} style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">빠른 시작</h2>
          <p className="text-gray-600 dark:text-gray-400">자주 사용하는 기능에 빠르게 접근하세요</p>
        </div>
        <Badge variant="info" className="animate-pulse bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
          새로운 기능
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={() => onActionClick(action)}
            className="animate-fade-in"
            style={{ animationDelay: `${0.6 + index * 0.1}s` }}
          >
            <QuickAction {...action} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsSection; 