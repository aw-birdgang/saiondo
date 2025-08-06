import { useState, useCallback, useMemo } from 'react';
import { addDays } from 'date-fns';
import { toast } from 'react-hot-toast';
import { MOCK_EVENTS } from '@/presentation/pages/calendar/constants/calendarData';
import type {
  Event,
  CalendarState,
  ViewMode,
  EventStats,
} from '@/presentation/pages/calendar/types/calendarTypes';

export const useCalendarData = () => {
  const [state, setState] = useState<CalendarState>({
    currentDate: new Date(),
    selectedDate: null,
    viewMode: 'month',
    events: MOCK_EVENTS,
    isEventFormOpen: false,
    editingEvent: null,
    selectedEventType: 'all',
    isLoading: false,
  });

  // 필터링된 이벤트
  const filteredEvents = useMemo(() => {
    if (state.selectedEventType === 'all') return state.events;
    return state.events.filter(event => event.type === state.selectedEventType);
  }, [state.events, state.selectedEventType]);

  // 이벤트 통계
  const eventStats = useMemo((): EventStats => {
    const stats: EventStats = {
      total: state.events.length,
      byType: {},
      byPriority: { low: 0, medium: 0, high: 0 },
    };

    state.events.forEach(event => {
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
      if (event.priority) {
        stats.byPriority[event.priority]++;
      }
    });

    return stats;
  }, [state.events]);

  // 이전/다음 이동
  const goToPrevious = useCallback(() => {
    setState(prev => {
      let newDate: Date;

      if (prev.viewMode === 'month') {
        newDate = new Date(
          prev.currentDate.getFullYear(),
          prev.currentDate.getMonth() - 1,
          1
        );
      } else if (prev.viewMode === 'week') {
        newDate = addDays(prev.currentDate, -7);
      } else {
        newDate = addDays(prev.currentDate, -1);
      }

      return { ...prev, currentDate: newDate };
    });
  }, []);

  const goToNext = useCallback(() => {
    setState(prev => {
      let newDate: Date;

      if (prev.viewMode === 'month') {
        newDate = new Date(
          prev.currentDate.getFullYear(),
          prev.currentDate.getMonth() + 1,
          1
        );
      } else if (prev.viewMode === 'week') {
        newDate = addDays(prev.currentDate, 7);
      } else {
        newDate = addDays(prev.currentDate, 1);
      }

      return { ...prev, currentDate: newDate };
    });
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setState(prev => ({
      ...prev,
      currentDate: today,
      selectedDate: today,
    }));
  }, []);

  // 뷰 모드 변경
  const handleViewModeChange = useCallback((viewMode: ViewMode) => {
    setState(prev => ({ ...prev, viewMode }));
  }, []);

  // 날짜 선택
  const handleDateClick = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
      isEventFormOpen: true,
      editingEvent: null,
    }));
  }, []);

  // 이벤트 추가/수정
  const handleEventSubmit = useCallback((eventData: Event) => {
    setState(prev => {
      if (prev.editingEvent) {
        // 이벤트 수정
        const updatedEvents = prev.events.map(e =>
          e.id === prev.editingEvent?.id
            ? { ...eventData, id: prev.editingEvent!.id }
            : e
        );
        toast.success('이벤트가 수정되었습니다.');
        return {
          ...prev,
          events: updatedEvents,
          isEventFormOpen: false,
          editingEvent: null,
        };
      } else {
        // 새 이벤트 추가
        const newEvent = { ...eventData, id: Date.now().toString() };
        toast.success('이벤트가 추가되었습니다.');
        return {
          ...prev,
          events: [...prev.events, newEvent],
          isEventFormOpen: false,
        };
      }
    });
  }, []);

  // 이벤트 편집
  const handleEventEdit = useCallback((event: Event) => {
    setState(prev => ({
      ...prev,
      editingEvent: event,
      isEventFormOpen: true,
    }));
  }, []);

  // 이벤트 삭제
  const handleEventDelete = useCallback((eventId: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId),
    }));
    toast.success('이벤트가 삭제되었습니다.');
  }, []);

  // 이벤트 폼 닫기
  const handleEventFormClose = useCallback(() => {
    setState(prev => ({
      ...prev,
      isEventFormOpen: false,
      editingEvent: null,
    }));
  }, []);

  // 이벤트 타입 필터 변경
  const handleEventTypeChange = useCallback((eventType: string) => {
    setState(prev => ({ ...prev, selectedEventType: eventType }));
  }, []);

  // 이벤트 클릭
  const handleEventClick = useCallback(
    (event: Event) => {
      // 이벤트 상세 보기 또는 편집 모드로 전환
      handleEventEdit(event);
    },
    [handleEventEdit]
  );

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = useCallback(
    (date: Date) => {
      return filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });
    },
    [filteredEvents]
  );

  return {
    // 상태
    currentDate: state.currentDate,
    selectedDate: state.selectedDate,
    viewMode: state.viewMode,
    events: state.events,
    filteredEvents,
    isEventFormOpen: state.isEventFormOpen,
    editingEvent: state.editingEvent,
    selectedEventType: state.selectedEventType,
    isLoading: state.isLoading,
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
    getEventsForDate,
  };
};
