import React from 'react';
import { Card, CardContent } from '../../common';
import { cn } from '../../../../utils/cn';
import type { ActivityStatsProps } from '../../../pages/mypage/types/mypageTypes';

const ActivityStats: React.FC<ActivityStatsProps> = ({
  stats,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-txt-secondary">{stat.label}</p>
                <p className="text-2xl font-bold text-txt">{stat.value}</p>
              </div>
              <div className={cn("text-sm font-medium", stat.color)}>
                {stat.trend}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActivityStats; 