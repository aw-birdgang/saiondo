import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {eachDayOfInterval, endOfMonth, startOfMonth} from 'date-fns';
import {
  CalendarHeader,
  CalendarGrid,
  EventList,
  EventForm
} from '../../components/specific';
import { PageWrapper, PageContainer } from '../../components/layout';

interface Event {
  id?: string;
  title: string;
  date: Date;
  type: 'meeting' | 'date' | 'anniversary' | 'other';
  description?: string;
  time?: string;
  location?: string;
}

const CalendarTab: React.FC = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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
    setIsEventFormOpen(true);
    setEditingEvent(null);
  };

  // 이벤트 추가/수정
  const handleEventSubmit = (event: Event) => {
    if (editingEvent) {
      // 기존 이벤트 수정
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? event : e));
    } else {
      // 새 이벤트 추가
      setEvents(prev => [...prev, event]);
    }
    setIsEventFormOpen(false);
    setEditingEvent(null);
  };

  // 이벤트 편집
  const handleEventEdit = (event: Event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  // 이벤트 삭제
  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // 이벤트 폼 닫기
  const handleEventFormClose = () => {
    setIsEventFormOpen(false);
    setEditingEvent(null);
  };

  return (
    <PageWrapper>
      <PageContainer>
        {/* Header */}
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
        />

        {/* Calendar Grid */}
        <CalendarGrid
          daysInMonth={daysInMonth}
          currentDate={currentDate}
          selectedDate={selectedDate}
          events={events}
          onDateClick={handleDateClick}
        />

        {/* Selected Date Events */}
        {selectedDate && (
          <EventList
            selectedDate={selectedDate}
            events={events.filter(event => {
              const eventDate = new Date(event.date);
              const selectedDateObj = new Date(selectedDate);
              return eventDate.toDateString() === selectedDateObj.toDateString();
            })}
            onAddEvent={() => setIsEventFormOpen(true)}
            onEditEvent={handleEventEdit}
            onDeleteEvent={handleEventDelete}
          />
        )}

        {/* Event Form Modal */}
        <EventForm
          event={editingEvent || undefined}
          selectedDate={selectedDate || new Date()}
          onSubmit={handleEventSubmit}
          onCancel={handleEventFormClose}
          isOpen={isEventFormOpen}
        />
      </PageContainer>
    </PageWrapper>
  );
};

export default CalendarTab;
