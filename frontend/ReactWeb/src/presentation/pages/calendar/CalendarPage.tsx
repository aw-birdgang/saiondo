import React, { useState, useCallback, useMemo } from 'react';
import { eachDayOfInterval, endOfMonth, startOfMonth, format, isSameDay, isSameMonth, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Badge,
  StatusBadge,
  LoadingSpinner,
  Modal,
  ModalFooter
} from '../../components/common';
import { useToastContext } from '../../providers/ToastProvider';
import { cn } from '../../../utils/cn';

interface Event {
  id?: string;
  title: string;
  date: Date;
  type: 'meeting' | 'date' | 'anniversary' | 'other' | 'work' | 'personal';
  description?: string;
  time?: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high';
  isAllDay?: boolean;
  color?: string;
}

type ViewMode = 'month' | 'week' | 'day';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToastContext();

  // 현재 월의 모든 날짜 계산
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 현재 주의 모든 날짜 계산
  const weekStart = startOfWeek(currentDate, { locale: ko });
  const weekEnd = endOfWeek(currentDate, { locale: ko });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // 이벤트 타입별 색상
  const eventTypeColors = {
    meeting: 'bg-blue-500',
    date: 'bg-pink-500',
    anniversary: 'bg-purple-500',
    other: 'bg-gray-500',
    work: 'bg-green-500',
    personal: 'bg-orange-500'
  };

  // 이벤트 타입별 라벨
  const eventTypeLabels = {
    meeting: '회의',
    date: '데이트',
    anniversary: '기념일',
    other: '기타',
    work: '업무',
    personal: '개인'
  };

  // 필터링된 이벤트
  const filteredEvents = useMemo(() => {
    if (selectedEventType === 'all') return events;
    return events.filter(event => event.type === selectedEventType);
  }, [events, selectedEventType]);

  // 이벤트 통계
  const eventStats = useMemo(() => {
    const stats = {
      total: events.length,
      byType: {} as Record<string, number>,
      byPriority: { low: 0, medium: 0, high: 0 }
    };

    events.forEach(event => {
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
      if (event.priority) {
        stats.byPriority[event.priority]++;
      }
    });

    return stats;
  }, [events]);

  // 이전/다음 이동
  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
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
  const handleEventSubmit = useCallback((event: Event) => {
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...event, id: editingEvent.id } : e));
      toast.success('이벤트가 수정되었습니다.');
    } else {
      const newEvent = { ...event, id: Date.now().toString() };
      setEvents(prev => [...prev, newEvent]);
      toast.success('이벤트가 추가되었습니다.');
    }
    setIsEventFormOpen(false);
    setEditingEvent(null);
  }, [editingEvent, toast]);

  // 이벤트 편집
  const handleEventEdit = (event: Event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  // 이벤트 삭제
  const handleEventDelete = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    toast.success('이벤트가 삭제되었습니다.');
  }, [toast]);

  // 이벤트 폼 닫기
  const handleEventFormClose = () => {
    setIsEventFormOpen(false);
    setEditingEvent(null);
  };

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(new Date(event.date), date));
  };

  // 월 뷰 렌더링
  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {/* 요일 헤더 */}
      {['일', '월', '화', '수', '목', '금', '토'].map(day => (
        <div key={day} className="p-2 text-center font-medium text-txt-secondary bg-focus rounded">
          {day}
        </div>
      ))}
      
      {/* 날짜 그리드 */}
      {daysInMonth.map((date, index) => {
        const dayEvents = getEventsForDate(date);
        const isToday = isSameDay(date, new Date());
        const isCurrentMonth = isSameMonth(date, currentDate);
        
        return (
          <div
            key={index}
            onClick={() => handleDateClick(date)}
            className={cn(
              'min-h-[100px] p-2 border border-border cursor-pointer transition-all duration-200',
              'hover:bg-focus hover:border-primary',
              isToday && 'bg-primary/10 border-primary',
              !isCurrentMonth && 'opacity-50 bg-focus/50',
              selectedDate && isSameDay(date, selectedDate) && 'ring-2 ring-primary'
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                'text-sm font-medium',
                isToday && 'text-primary font-bold'
              )}>
                {format(date, 'd')}
              </span>
              {dayEvents.length > 0 && (
                <Badge variant="secondary" size="sm">
                  {dayEvents.length}
                </Badge>
              )}
            </div>
            
            {/* 이벤트 미리보기 */}
            <div className="space-y-1">
              {dayEvents.slice(0, 2).map(event => (
                <div
                  key={event.id}
                  className={cn(
                    'text-xs p-1 rounded truncate cursor-pointer',
                    eventTypeColors[event.type],
                    'text-white'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventEdit(event);
                  }}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-txt-secondary">
                  +{dayEvents.length - 2}개 더
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // 주 뷰 렌더링
  const renderWeekView = () => (
    <div className="grid grid-cols-7 gap-1">
      {/* 요일 헤더 */}
      {daysInWeek.map(date => (
        <div key={date.toISOString()} className="p-2 text-center">
          <div className="font-medium text-txt-secondary">
            {format(date, 'EEE', { locale: ko })}
          </div>
          <div className={cn(
            'text-lg font-bold',
            isSameDay(date, new Date()) && 'text-primary'
          )}>
            {format(date, 'd')}
          </div>
        </div>
      ))}
      
      {/* 이벤트 영역 */}
      {daysInWeek.map(date => {
        const dayEvents = getEventsForDate(date);
        const isToday = isSameDay(date, new Date());
        
        return (
          <div
            key={date.toISOString()}
            className={cn(
              'min-h-[200px] p-2 border border-border',
              isToday && 'bg-primary/5 border-primary'
            )}
          >
            <div className="space-y-1">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className={cn(
                    'text-xs p-2 rounded cursor-pointer transition-colors',
                    eventTypeColors[event.type],
                    'text-white hover:opacity-80'
                  )}
                  onClick={() => handleEventEdit(event)}
                  title={`${event.title}${event.time ? ` - ${event.time}` : ''}`}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  {event.time && (
                    <div className="text-xs opacity-90">{event.time}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // 일 뷰 렌더링
  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-txt">
            {format(currentDate, 'yyyy년 M월 d일 EEEE', { locale: ko })}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {hours.map(hour => {
            const hourEvents = dayEvents.filter(event => {
              if (!event.time) return false;
              const eventHour = parseInt(event.time.split(':')[0]);
              return eventHour === hour;
            });
            
            return (
              <div key={hour} className="flex items-center space-x-4 p-2 border-b border-border">
                <div className="w-16 text-sm font-medium text-txt-secondary">
                  {format(new Date().setHours(hour), 'HH:mm')}
                </div>
                <div className="flex-1">
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        'p-2 rounded mb-1 cursor-pointer',
                        eventTypeColors[event.type],
                        'text-white'
                      )}
                      onClick={() => handleEventEdit(event)}
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-sm opacity-90">{event.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <CardTitle className="text-2xl">
                  {viewMode === 'month' && format(currentDate, 'yyyy년 M월', { locale: ko })}
                  {viewMode === 'week' && `${format(weekStart, 'M월 d일', { locale: ko })} - ${format(weekEnd, 'M월 d일', { locale: ko })}`}
                  {viewMode === 'day' && format(currentDate, 'yyyy년 M월 d일', { locale: ko })}
                </CardTitle>
              </div>
              
              {/* 뷰 모드 선택 */}
              <div className="flex space-x-1">
                {(['month', 'week', 'day'] as ViewMode[]).map(mode => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                  >
                    {mode === 'month' ? '월' : mode === 'week' ? '주' : '일'}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={goToPrevious}>
                ‹
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                오늘
              </Button>
              <Button variant="outline" size="sm" onClick={goToNext}>
                ›
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-txt">{eventStats.total}</div>
            <div className="text-sm text-txt-secondary">총 이벤트</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{eventStats.byType.meeting || 0}</div>
            <div className="text-sm text-txt-secondary">회의</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{eventStats.byType.work || 0}</div>
            <div className="text-sm text-txt-secondary">업무</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{eventStats.byPriority.high || 0}</div>
            <div className="text-sm text-txt-secondary">높은 우선순위</div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-txt">이벤트 타입:</span>
            <div className="flex space-x-2">
              <Button
                variant={selectedEventType === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedEventType('all')}
              >
                전체
              </Button>
              {Object.entries(eventTypeLabels).map(([type, label]) => (
                <Button
                  key={type}
                  variant={selectedEventType === type ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedEventType(type)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 캘린더 뷰 */}
      <Card>
        <CardContent className="p-6">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </CardContent>
      </Card>

      {/* 선택된 날짜 이벤트 목록 */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              {format(selectedDate, 'M월 d일', { locale: ko })} 이벤트
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getEventsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8 text-txt-secondary">
                이 날에는 이벤트가 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {getEventsForDate(selectedDate).map(event => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-focus transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn('w-3 h-3 rounded-full', eventTypeColors[event.type])} />
                      <div>
                        <div className="font-medium text-txt">{event.title}</div>
                        {event.time && (
                          <div className="text-sm text-txt-secondary">{event.time}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.priority && (
                        <StatusBadge 
                          status={event.priority === 'high' ? 'error' : event.priority === 'medium' ? 'warning' : 'success'} 
                          size="sm"
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEventEdit(event)}
                      >
                        편집
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => event.id && handleEventDelete(event.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
              {Object.entries(eventTypeLabels).map(([type, label]) => (
                <option key={type} value={type} selected={editingEvent?.type === type}>
                  {label}
                </option>
              ))}
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
        
        <ModalFooter>
          <Button variant="outline" onClick={handleEventFormClose}>
            취소
          </Button>
          <Button onClick={() => handleEventSubmit(editingEvent || { title: '', date: selectedDate || new Date(), type: 'other' })}>
            {editingEvent ? '수정' : '추가'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CalendarPage;
