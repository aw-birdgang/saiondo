import React from 'react';
import { LoadingSpinner, Modal } from '../../components/common';
import { 
  CalendarHeader, 
  MonthView, 
  CalendarSidebar, 
  CalendarContainer 
} from '../../components/specific/calendar';
import { useCalendarData } from './hooks/useCalendarData';

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
    selectedEventType,
    isLoading,
    eventStats,

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
    handleEventTypeChange,
    handleEventClick,
    getEventsForDate
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
      <Modal
        isOpen={isEventFormOpen}
        onClose={handleEventFormClose}
        title={editingEvent ? '이벤트 수정' : '새 이벤트 추가'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-txt mb-1">제목</label>
            <input
              type="text"
              defaultValue={editingEvent?.title || ''}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="이벤트 제목을 입력하세요"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-txt mb-1">타입</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="meeting">회의</option>
              <option value="date">데이트</option>
              <option value="anniversary">기념일</option>
              <option value="work">업무</option>
              <option value="personal">개인</option>
              <option value="other">기타</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-txt mb-1">시간</label>
            <input
              type="time"
              defaultValue={editingEvent?.time || ''}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-txt mb-1">설명</label>
            <textarea
              defaultValue={editingEvent?.description || ''}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="이벤트 설명을 입력하세요"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={handleEventFormClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-focus"
          >
            취소
          </button>
          <button
            onClick={() => handleEventSubmit(editingEvent || { title: '', date: selectedDate || new Date(), type: 'other' })}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            {editingEvent ? '수정' : '추가'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarPage;
