import React from 'react';
import { Button, StatusBadge } from '../../common';
import { cn } from '../../../../utils/cn';
import { EVENT_TYPE_CONFIG } from '../../../pages/calendar/constants/calendarData';
import type { EventItemProps } from '../../../pages/calendar/types/calendarTypes';

const EventItem: React.FC<EventItemProps> = ({
  event,
  onClick,
  onEdit,
  onDelete,
  className,
}) => {
  const handleClick = () => {
    onClick(event);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(event);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.id) {
      onDelete(event.id);
    }
  };

  const getPriorityStatus = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-3 border border-border rounded-lg cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:border-primary',
        className
      )}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center space-x-2 mb-2'>
            <div
              className={cn(
                'w-3 h-3 rounded-full',
                EVENT_TYPE_CONFIG[event.type].color
              )}
            />
            <h3 className='font-medium text-txt truncate'>{event.title}</h3>
          </div>

          {event.description && (
            <p className='text-sm text-txt-secondary mb-2 line-clamp-2'>
              {event.description}
            </p>
          )}

          <div className='flex items-center space-x-4 text-xs text-txt-secondary'>
            {event.time && <span>🕐 {event.time}</span>}
            {event.location && <span>📍 {event.location}</span>}
            {event.isAllDay && <span>📅 종일</span>}
          </div>
        </div>

        <div className='flex items-center space-x-2 ml-4'>
          {event.priority && (
            <StatusBadge status={getPriorityStatus(event.priority)} size='sm' />
          )}
          <Button variant='ghost' size='sm' onClick={handleEdit}>
            편집
          </Button>
          <Button variant='destructive' size='sm' onClick={handleDelete}>
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
