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
      case 'meeting': return 'bg-blue-500';
      case 'date': return 'bg-pink-500';
      case 'anniversary': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(selectedDate, 'yyyy년 M월 d일', { locale: ko })}
        </h3>
        <button
          onClick={onAddEvent}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {t('add_event')}
        </button>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            {t('no_events')}
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg ${getEventColor(event.type)} text-white`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm opacity-90 mt-1">{event.description}</p>
                  )}
                  {event.time && (
                    <p className="text-xs opacity-75 mt-1">🕐 {event.time}</p>
                  )}
                  {event.location && (
                    <p className="text-xs opacity-75 mt-1">📍 {event.location}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-3">
                  {onEditEvent && (
                    <button
                      onClick={() => onEditEvent(event)}
                      className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded transition-colors"
                    >
                      ✏️
                    </button>
                  )}
                  {onDeleteEvent && event.id && (
                    <button
                      onClick={() => onDeleteEvent(event.id!)}
                      className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded transition-colors"
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