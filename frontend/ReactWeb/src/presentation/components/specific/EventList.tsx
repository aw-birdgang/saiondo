import React from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Event {
  id?: string;
  title: string;
  date: Date;
  type: 'meeting' | 'date' | 'anniversary' | 'other';
  description?: string;
  time?: string;
  location?: string;
}

interface EventListProps {
  selectedDate: Date;
  events: Event[];
  onAddEvent: () => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
  className?: string;
}

const EventList: React.FC<EventListProps> = ({ 
  selectedDate, 
  events, 
  onAddEvent, 
  onEditEvent,
  onDeleteEvent,
  className = "" 
}) => {
  const { t } = useTranslation();

  // 이벤트 타입별 색상
  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-primary';
      case 'date': return 'bg-pink-500';
      case 'anniversary': return 'bg-error';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-txt leading-tight">
          {format(selectedDate, 'yyyy년 M월 d일', { locale: ko })}
        </h3>
        <button
          onClick={onAddEvent}
          className="btn btn-primary px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
        >
          {t('add_event') || '이벤트 추가'}
        </button>
      </div>

      <div className="space-y-6">
        {events.length === 0 ? (
          <p className="text-txt-secondary text-center py-12 text-lg font-medium">
            {t('no_events') || '등록된 이벤트가 없습니다'}
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`p-6 rounded-xl ${getEventColor(event.type)} text-white shadow-md border border-white/20`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg leading-tight">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm opacity-90 mt-3 leading-relaxed">{event.description}</p>
                  )}
                  {event.time && (
                    <p className="text-xs opacity-75 mt-3 font-medium">🕐 {event.time}</p>
                  )}
                  {event.location && (
                    <p className="text-xs opacity-75 mt-2 font-medium">📍 {event.location}</p>
                  )}
                </div>
                <div className="flex gap-3 ml-6">
                  {onEditEvent && (
                    <button
                      onClick={() => onEditEvent(event)}
                      className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      ✏️
                    </button>
                  )}
                  {onDeleteEvent && event.id && (
                    <button
                      onClick={() => onDeleteEvent(event.id!)}
                      className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList; 