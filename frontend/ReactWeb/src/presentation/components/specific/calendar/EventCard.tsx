import React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'date' | 'anniversary' | 'other';
  description?: string;
}

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  className = '',
}) => {
  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return '🤝';
      case 'date': return '💕';
      case 'anniversary': return '🎉';
      default: return '📅';
    }
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'date': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      case 'anniversary': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getEventTypeName = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return '미팅';
      case 'date': return '데이트';
      case 'anniversary': return '기념일';
      default: return '기타';
    }
  };

  return (
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        {/* Event Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
            <span className="text-lg">{getEventIcon(event.type)}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Event Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {event.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.type)}`}>
                {getEventTypeName(event.type)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(event)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(event.id)}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Event Date */}
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {format(event.date, 'yyyy년 M월 d일 EEEE', { locale: ko })}
            </span>
          </div>

          {/* Event Description */}
          {event.description && (
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard; 