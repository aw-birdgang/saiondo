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
    className="cursor-pointer group"
  >
    <CardContent className="p-6">
      <div className="flex items-start space-x-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 relative transition-all duration-200",
          gradient ? "bg-gradient-to-br from-primary to-primary-container" : color,
          "group-hover:scale-110 group-hover:shadow-lg"
        )}>
          <div className="text-white group-hover:rotate-12 transition-transform duration-200">
            {icon}
          </div>
          {badge && (
            <CounterBadge
              count={parseInt(badge)}
              className="absolute -top-2 -right-2 group-hover:scale-110 transition-transform duration-200"
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-txt group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-txt-secondary mt-1 group-hover:text-txt transition-colors duration-200">
            {description}
          </p>
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-txt">빠른 시작</h2>
        <Badge variant="info" className="animate-pulse">새로운 기능</Badge>
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