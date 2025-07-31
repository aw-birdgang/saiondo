import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '../../components/common';
import { Calendar, EventCard } from '../../components/specific/calendar';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'date' | 'anniversary' | 'other';
  description?: string;
}

const CalendarTab: React.FC = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  // 현재 월의 모든 날짜 계산
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 이전/다음 월 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // 날짜 선택
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // 이벤트 추가
  const handleAddEvent = () => {
    if (!selectedDate) return;
    
    const newEvent: Event = {
      id: Date.now().toString(),
      title: '새로운 일정',
      date: selectedDate,
      type: 'other',
    };
    
    setEvents([...events, newEvent]);
  };

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  // 이벤트 타입별 색상
  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'date': return 'bg-pink-500';
      case 'anniversary': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('calendar')}
            </h2>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('today')}
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {format(currentDate, 'yyyy년 M월', { locale: ko })}
            </h3>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={`
                    min-h-[80px] p-2 border border-gray-200 dark:border-dark-border cursor-pointer transition-colors
                    ${isCurrentMonth ? 'bg-white dark:bg-dark-secondary-container' : 'bg-gray-100 dark:bg-dark-surface'}
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                    ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    hover:bg-gray-50 dark:hover:bg-dark-surface
                  `}
                >
                  <div className="text-sm font-medium mb-1">
                    <span className={`
                      ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'}
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
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {format(selectedDate, 'yyyy년 M월 d일', { locale: ko })}
              </h3>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {t('add_event')}
              </button>
            </div>

            <div className="space-y-3">
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  {t('no_events')}
                </p>
              ) : (
                getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg ${getEventColor(event.type)} text-white`}
                  >
                    <h4 className="font-medium">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm opacity-90 mt-1">{event.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarTab; 