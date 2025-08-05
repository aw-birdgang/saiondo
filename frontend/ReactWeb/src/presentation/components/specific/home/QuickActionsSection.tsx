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
    className="cursor-pointer group relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
  >
    {/* Enhanced Background Pattern */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 transform rotate-12 scale-150"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-3xl"></div>
    </div>
    
    <CardContent className="relative p-6 lg:p-8">
      <div className="flex items-start space-x-4 lg:space-x-6">
        <div className={cn(
          "relative w-14 h-14 lg:w-16 lg:h-16 rounded-3xl flex items-center justify-center flex-shrink-0 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3",
          gradient 
            ? "bg-gradient-to-br from-red-500 via-pink-500 to-red-600" 
            : "bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600"
        )}>
          <div className="text-white text-xl lg:text-2xl group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
          {/* Icon glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl blur-sm"></div>
          {badge && (
            <CounterBadge
              count={parseInt(badge)}
              className="absolute -top-2 -right-2 group-hover:scale-110 transition-transform duration-500 bg-red-500 text-white shadow-lg"
            />
          )}
        </div>
        <div className="flex-1 space-y-3">
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-lg lg:text-xl">
            {title}
          </h3>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center space-x-2 pt-3">
            <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 font-semibold uppercase tracking-wider">
              시작하기
            </span>
            <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 lg:mb-10 space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            빠른 시작
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            자주 사용하는 기능에 빠르게 접근하세요
          </p>
        </div>
        <Badge variant="info" className="animate-pulse bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white border-0 shadow-lg w-fit">
          새로운 기능
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={() => onActionClick(action)}
            className="animate-fade-in transform hover:scale-105 transition-transform duration-300"
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