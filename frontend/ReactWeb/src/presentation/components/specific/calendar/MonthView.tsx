import React from 'react';
import {
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { cn } from '@/utils/cn';
import { DAY_LABELS } from '@/presentation/pages/calendar/constants/calendarData';
import CalendarDay from '@/presentation/components/specific/calendar/CalendarDay';
import type {
  MonthViewProps,
  Event,
} from '@/presentation/pages/calendar/types/calendarTypes';

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  selectedDate,
  events,
  onDateClick,
  onEventClick,
  className,
}) => {
  // 현재 월의 모든 날짜 계산
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className={cn('grid grid-cols-7 gap-1', className)}>
      {/* 요일 헤더 */}
      {DAY_LABELS.map(day => (
        <div
          key={day}
          className='p-2 text-center font-medium text-txt-secondary bg-focus rounded'
        >
          {day}
        </div>
      ))}

      {/* 날짜 그리드 */}
      {daysInMonth.map((date, index) => {
        const dayEvents = getEventsForDate(date);
        const isToday = isSameDay(date, new Date());
        const isCurrentMonth = isSameMonth(date, currentDate);
        const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

        return (
          <CalendarDay
            key={index}
            date={date}
            isToday={isToday}
            isCurrentMonth={isCurrentMonth}
            isSelected={isSelected}
            events={dayEvents}
            onClick={onDateClick}
            onEventClick={onEventClick}
          />
        );
      })}
    </div>
  );
};

export default MonthView;
