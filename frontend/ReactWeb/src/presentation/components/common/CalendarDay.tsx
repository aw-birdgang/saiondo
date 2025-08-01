import React from 'react';
import { format, isSameDay, isSameMonth, isToday } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'date' | 'anniversary' | 'other';
  description?: string;
}

interface CalendarDayProps {
  day: Date;
  currentDate: Date;
  selectedDate: Date | null;
  events: Event[];
  onDateClick: (date: Date) => void;
  className?: string;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  currentDate,
  selectedDate,
  events,
  onDateClick,
  className = '',
}) => {
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'date': return 'bg-pink-500';
      case 'anniversary': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const dayEvents = getEventsForDate(day);
  const isCurrentMonth = isSameMonth(day, currentDate);
  const isSelected = selectedDate && isSameDay(day, selectedDate);
  const isCurrentDay = isToday(day);

  return (
    <div
      onClick={() => onDateClick(day)}
      className={`
        min-h-[80px] p-2 border border-gray-200 dark:border-gray-600 cursor-pointer transition-colors
        ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
        hover:bg-gray-50 dark:hover:bg-gray-700
        ${className}
      `}
    >
      <div className="text-sm font-medium mb-1">
        <span className={`
          ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}
          ${isCurrentDay ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}
        `}>
          {format(day, 'd')}
        </span>
      </div>

      {/* Events */}
      <div className="space-y-1">
        {dayEvents.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className={`text-xs px-1 py-0.5 rounded ${getEventColor(event.type)} text-white truncate`}
            title={event.title}
          >
            {event.title}
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            +{dayEvents.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay; 