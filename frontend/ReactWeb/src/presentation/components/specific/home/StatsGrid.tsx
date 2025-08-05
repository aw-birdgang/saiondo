import React from 'react';
import { Card, CardContent } from '../../common';
import { AnimatedCounter } from '../../common/AnimatedCounter';
import { cn } from '../../../../utils/cn';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
  color?: 'red' | 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  delay = 0,
  color = 'blue'
}) => {
  const colorClasses = {
    red: {
      bg: 'bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-red-900/30 dark:via-pink-900/20 dark:to-red-800/30',
      icon: 'bg-gradient-to-br from-red-500 via-pink-500 to-red-600',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200/50 dark:border-red-800/50',
      hover: 'hover:border-red-300 dark:hover:border-red-700',
      glow: 'shadow-red-500/20'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-blue-800/30',
      icon: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200/50 dark:border-blue-800/50',
      hover: 'hover:border-blue-300 dark:hover:border-blue-700',
      glow: 'shadow-blue-500/20'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-green-800/30',
      icon: 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200/50 dark:border-green-800/50',
      hover: 'hover:border-green-300 dark:hover:border-green-700',
      glow: 'shadow-green-500/20'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 dark:from-purple-900/30 dark:via-violet-900/20 dark:to-purple-800/30',
      icon: 'bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200/50 dark:border-purple-800/50',
      hover: 'hover:border-purple-300 dark:hover:border-purple-700',
      glow: 'shadow-purple-500/20'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-orange-900/30 dark:via-amber-900/20 dark:to-orange-800/30',
      icon: 'bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200/50 dark:border-orange-800/50',
      hover: 'hover:border-orange-300 dark:hover:border-orange-700',
      glow: 'shadow-orange-500/20'
    }
  };

  const colors = colorClasses[color];

  return (
    <Card
      variant="elevated"
      hover="lift"
      className={cn(
        "group relative overflow-hidden transition-all duration-500 backdrop-blur-sm",
        colors.bg,
        colors.border,
        colors.hover,
        "hover:shadow-2xl hover:scale-105 hover:-translate-y-2",
        colors.glow,
        className
      )}
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <div className={cn("absolute inset-0 transform rotate-12 scale-150 opacity-10", colors.bg.replace('bg-gradient-to-br', 'bg-gradient-to-r'))}></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <CardContent className="relative p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <p className={cn("text-sm font-bold transition-colors duration-300 uppercase tracking-wider", colors.text)}>
                {title}
              </p>
              {trend && (
                <div className="flex items-center space-x-1">
                  <span className={cn(
                    "text-xs font-bold flex items-center px-3 py-1.5 rounded-full backdrop-blur-sm",
                    trend.isPositive 
                      ? "bg-green-100/80 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200/50 dark:border-green-800/50" 
                      : "bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200/50 dark:border-red-800/50"
                  )}>
                    <svg
                      className={cn(
                        "w-3 h-3 mr-1.5 transition-transform duration-300",
                        trend.isPositive ? "rotate-0" : "rotate-180"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                  </span>
                </div>
              )}
            </div>
            
            <div className={cn("text-3xl lg:text-4xl font-bold transition-colors duration-300", colors.text)}>
              <AnimatedCounter
                value={value}
                formatNumber={true}
                delay={delay}
                className="group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className={cn(
            "relative w-16 h-16 lg:w-20 lg:h-20 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500",
            colors.icon
          )}>
            <div className="text-white text-xl lg:text-2xl group-hover:scale-110 transition-transform duration-500">
              {icon}
            </div>
            {/* Icon glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl blur-sm"></div>
          </div>
        </div>
        
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 lg:w-24 lg:h-24 opacity-10">
          <div className={cn("w-full h-full rounded-full blur-xl", colors.icon)}></div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatsGridProps {
  stats: Array<{
    title: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    trend?: {
      value: number;
      isPositive: boolean;
    };
    color?: 'red' | 'blue' | 'green' | 'purple' | 'orange';
  }>;
  className?: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, className }) => {
  const colors: Array<'red' | 'blue' | 'green' | 'purple' | 'orange'> = ['blue', 'green', 'purple', 'orange'];
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8", className)}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
          color={stat.color || colors[index % colors.length]}
          delay={200 + index * 200}
        />
      ))}
    </div>
  );
};

export default StatsGrid; 