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
      bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      icon: 'bg-gradient-to-br from-red-500 to-red-600',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      hover: 'hover:border-red-300 dark:hover:border-red-700'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      hover: 'hover:border-blue-300 dark:hover:border-blue-700'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      icon: 'bg-gradient-to-br from-green-500 to-green-600',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      hover: 'hover:border-green-300 dark:hover:border-green-700'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      icon: 'bg-gradient-to-br from-purple-500 to-purple-600',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      hover: 'hover:border-purple-300 dark:hover:border-purple-700'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      icon: 'bg-gradient-to-br from-orange-500 to-orange-600',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
      hover: 'hover:border-orange-300 dark:hover:border-orange-700'
    }
  };

  const colors = colorClasses[color];

  return (
    <Card
      variant="elevated"
      hover="lift"
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        colors.bg,
        colors.border,
        colors.hover,
        "hover:shadow-xl hover:scale-105",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={cn("absolute inset-0 transform rotate-12 scale-150", colors.bg.replace('bg-gradient-to-br', 'bg-gradient-to-r'))}></div>
      </div>
      
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <p className={cn("text-sm font-semibold transition-colors duration-200", colors.text)}>
                {title}
              </p>
              {trend && (
                <div className="flex items-center space-x-1">
                  <span className={cn(
                    "text-xs font-bold flex items-center px-2 py-1 rounded-full",
                    trend.isPositive 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    <svg
                      className={cn(
                        "w-3 h-3 mr-1 transition-transform duration-200",
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
            
            <div className={cn("text-3xl font-bold transition-colors duration-200", colors.text)}>
              <AnimatedCounter
                value={value}
                formatNumber={true}
                delay={delay}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200">
              {description}
            </p>
          </div>
          
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200",
            colors.icon
          )}>
            <div className="text-white group-hover:scale-110 transition-transform duration-200">
              {icon}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
          <div className={cn("w-full h-full rounded-full", colors.icon)}></div>
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
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
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