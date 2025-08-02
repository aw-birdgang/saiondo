import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import Button from '../../common/Button';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'date' | 'anniversary' | 'other';
  description?: string;
}

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: Event[];
  onDateClick: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  selectedDate,
  events,
  onDateClick,
  onPreviousMonth,
  onNextMonth,
  onToday,
  className = '',
}) => {
  // 현재 월의 모든 날짜 계산
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 이벤트 타입별 색상
  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'date': return 'bg-pink-500';
      case 'anniversary': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  // 요일 헤더
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h2>
        <Button
          variant="primary"
          size="sm"
          onClick={onToday}
        >
          오늘
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </span>
        
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {daysInMonth.map((date) => {
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const dayEvents = getEventsForDate(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateClick(date)}
              className={`p-2 h-12 text-sm relative transition-colors ${
                !isCurrentMonth
                  ? 'text-gray-300 dark:text-gray-600'
                  : isSelected
                  ? 'bg-blue-500 text-white rounded-lg'
                  : isTodayDate
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg'
                  : 'hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-900 dark:text-white'
              }`}
            >
              <span className="block">{format(date, 'd')}</span>
              
              {/* Event indicators */}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`w-1 h-1 rounded-full ${getEventColor(event.type)}`}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar; 