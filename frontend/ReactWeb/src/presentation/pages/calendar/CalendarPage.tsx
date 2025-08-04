import React from 'react';
import {LoadingSpinner} from '../../components/common';
import {CalendarContainer, CalendarHeader, CalendarSidebar, MonthView, EventFormModal} from '../../components/specific/calendar';
import {useCalendarData} from './hooks/useCalendarData';

const CalendarPage: React.FC = () => {
  const {
    // 상태
    currentDate,
    selectedDate,
    viewMode,
    events,
    filteredEvents,
    isEventFormOpen,
    editingEvent,
    isLoading,

    // 액션
    goToPrevious,
    goToNext,
    goToToday,
    handleViewModeChange,
    handleDateClick,
    handleEventSubmit,
    handleEventEdit,
    handleEventDelete,
    handleEventFormClose,
    handleEventClick,
  } = useCalendarData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderCalendarView = () => {
    switch (viewMode) {
      case 'month':
        return (
          <MonthView
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={filteredEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        );
      case 'week':
        return (
          <div className="text-center py-8">
            <p className="text-txt-secondary">주 뷰는 준비 중입니다.</p>
          </div>
        );
      case 'day':
        return (
          <div className="text-center py-8">
            <p className="text-txt-secondary">일 뷰는 준비 중입니다.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* 메인 캘린더 영역 */}
      <div className="flex-1 flex flex-col">
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onToday={goToToday}
          onViewModeChange={handleViewModeChange}
        />

        <CalendarContainer>
          {renderCalendarView()}
        </CalendarContainer>
      </div>

      {/* 사이드바 */}
      <div className="border-l border-border">
        <CalendarSidebar
          events={events}
          selectedDate={selectedDate}
          onEventEdit={handleEventEdit}
          onEventDelete={handleEventDelete}
        />
      </div>

      {/* 이벤트 폼 모달 */}
      <EventFormModal
        isOpen={isEventFormOpen}
        onClose={handleEventFormClose}
        onSubmit={handleEventSubmit}
        editingEvent={editingEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarPage;
