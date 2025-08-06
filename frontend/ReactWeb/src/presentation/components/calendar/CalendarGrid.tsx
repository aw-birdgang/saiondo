import React from 'react';
import {CalendarDay,} from '@/presentation/components/common';
import { CalendarHeader } from "@/presentation/components/calendar";

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'date' | 'anniversary' | 'other';
  description?: string;
}

interface CalendarGridProps {
  daysInMonth: Date[];
  currentDate: Date;
  selectedDate: Date | null;
  events: Event[];
  onDateClick: (date: Date) => void;
  className?: string;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  daysInMonth,
  currentDate,
  selectedDate,
  events,
  onDateClick,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Day Headers */}
      <CalendarHeader />

      {/* Calendar Days */}
      <div className='grid grid-cols-7 gap-3'>
        {daysInMonth.map(day => (
          <CalendarDay
            key={day.toISOString()}
            day={day}
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={events}
            onDateClick={onDateClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
