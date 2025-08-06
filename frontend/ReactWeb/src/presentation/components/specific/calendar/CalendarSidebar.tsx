import React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '@/presentation/components/common';
import { cn } from '@/utils/cn';
import EventItem from '@/presentation/components/specific/calendar/EventItem';
import type {
  CalendarSidebarProps,
  Event,
} from '@/presentation/pages/calendar/types/calendarTypes';

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  events,
  selectedDate,
  onEventEdit,
  onEventDelete,
  className,
}) => {
  const getEventsForSelectedDate = (): Event[] => {
    if (!selectedDate) return [];

    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDate.toDateString();
    });
  };

  const selectedDateEvents = getEventsForSelectedDate();

  if (!selectedDate) {
    return (
      <Card className={cn('w-80', className)}>
        <CardHeader>
          <CardTitle>이벤트</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-txt-secondary text-center py-8'>
            날짜를 선택하여 이벤트를 확인하세요
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-80', className)}>
      <CardHeader>
        <CardTitle>{format(selectedDate, 'M월 d일', { locale: ko })}</CardTitle>
        <p className='text-sm text-txt-secondary'>
          {format(selectedDate, 'yyyy년 M월 d일 EEEE', { locale: ko })}
        </p>
      </CardHeader>
      <CardContent>
        {selectedDateEvents.length === 0 ? (
          <p className='text-txt-secondary text-center py-8'>
            이 날짜에 등록된 이벤트가 없습니다
          </p>
        ) : (
          <div className='space-y-3'>
            {selectedDateEvents.map(event => (
              <EventItem
                key={event.id}
                event={event}
                onClick={() => onEventEdit(event)}
                onEdit={onEventEdit}
                onDelete={onEventDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarSidebar;
