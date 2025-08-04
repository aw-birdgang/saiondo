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
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  delay = 0
}) => (
  <Card
    variant="elevated"
    hover="lift"
    className={cn("group", className)}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-txt-secondary group-hover:text-primary transition-colors duration-200">
            {title}
          </p>
          <div className="text-3xl font-bold text-txt mt-2">
            <AnimatedCounter
              value={value}
              formatNumber={true}
              delay={delay}
              className="group-hover:text-primary transition-colors duration-200"
            />
          </div>
          <p className="text-sm text-txt-secondary mt-1 group-hover:text-txt transition-colors duration-200">
            {description}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-sm font-medium flex items-center",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                <svg
                  className={cn(
                    "w-4 h-4 mr-1 transition-transform duration-200",
                    trend.isPositive ? "rotate-0" : "rotate-180"
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-txt-secondary ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-all duration-200">
          <div className="text-primary group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

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
  }>;
  className?: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
          delay={200 + index * 200}
        />
      ))}
    </div>
  );
};

export default StatsGrid; 