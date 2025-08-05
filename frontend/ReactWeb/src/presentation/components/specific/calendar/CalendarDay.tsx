import React from 'react';
import { format } from 'date-fns';
import { cn } from '../../../../utils/cn';
import { EVENT_TYPE_CONFIG } from '../../../pages/calendar/constants/calendarData';
import type { CalendarDayProps, Event } from '../../../pages/calendar/types/calendarTypes';

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isToday,
  isCurrentMonth,
  isSelected,
  events,
  onClick,
  onEventClick,
  className
}) => {
  const handleClick = () => {
    onClick(date);
  };

  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    onEventClick(event);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'min-h-[100px] p-2 border border-border cursor-pointer transition-all duration-200',
        'hover:bg-focus hover:border-primary',
        isToday && 'bg-primary/10 border-primary',
        !isCurrentMonth && 'opacity-50 bg-focus/50',
        isSelected && 'ring-2 ring-primary',
        className
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={cn(
          'text-sm font-medium',
          isToday && 'text-primary font-bold',
          !isCurrentMonth && 'text-txt-secondary'
        )}>
          {format(date, 'd')}
        </span>
        {isToday && (
          <span className="w-2 h-2 bg-primary rounded-full"></span>
        )}
      </div>

      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            onClick={(e) => handleEventClick(e, event)}
            className={cn(
              'text-xs p-1 rounded truncate cursor-pointer transition-colors',
              'hover:opacity-80',
              EVENT_TYPE_CONFIG[event.type].color,
              'text-white'
            )}
            title={event.title}
          >
            {event.title}
          </div>
        ))}
        {events.length > 3 && (
          <div className="text-xs text-txt-secondary text-center">
            +{events.length - 3}개 더
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay; 