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
      case 'meeting': return 'bg-primary text-on-primary';
      case 'date': return 'bg-pink-500 text-white';
      case 'anniversary': return 'bg-red-500 text-white';
      default: return 'bg-secondary text-txt-secondary';
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
        min-h-[100px] p-3 border border-border cursor-pointer transition-all duration-200
        ${isCurrentMonth ? 'bg-surface' : 'bg-secondary/50'}
        ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}
        ${isCurrentDay ? 'bg-primary/5 border-primary/30' : ''}
        hover:bg-secondary hover:shadow-md hover:scale-[1.02]
        ${className}
      `}
    >
      <div className="text-sm font-medium mb-2">
        <span className={`
          ${isCurrentMonth ? 'text-txt' : 'text-txt-secondary'}
          ${isCurrentDay ? 'text-primary font-bold' : ''}
          ${isSelected ? 'text-primary' : ''}
        `}>
          {format(day, 'd')}
        </span>
      </div>

      {/* Events */}
      <div className="space-y-1">
        {dayEvents.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className={`text-xs px-2 py-1 rounded-md ${getEventColor(event.type)} truncate font-medium`}
            title={event.title}
          >
            {event.title}
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div className="text-xs text-txt-secondary font-medium">
            +{dayEvents.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay; 