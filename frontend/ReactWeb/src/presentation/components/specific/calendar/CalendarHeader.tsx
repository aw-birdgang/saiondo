import React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '../../common';
import { cn } from '../../../../utils/cn';
import { VIEW_MODE_OPTIONS } from '../../../pages/calendar/constants/calendarData';
import type {
  CalendarHeaderProps,
  ViewMode,
} from '../../../pages/calendar/types/calendarTypes';

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
  className,
}) => {
  const getDateDisplay = () => {
    switch (viewMode) {
      case 'month':
        return format(currentDate, 'yyyy년 M월', { locale: ko });
      case 'week':
        return format(currentDate, 'yyyy년 M월 d일', { locale: ko });
      case 'day':
        return format(currentDate, 'yyyy년 M월 d일', { locale: ko });
      default:
        return format(currentDate, 'yyyy년 M월', { locale: ko });
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 bg-surface border-b border-border',
        className
      )}
    >
      <div className='flex items-center space-x-4'>
        <div className='flex items-center space-x-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onPrevious}
            className='p-2'
          >
            ←
          </Button>
          <Button variant='ghost' size='sm' onClick={onNext} className='p-2'>
            →
          </Button>
        </div>

        <h1 className='text-xl font-semibold text-txt'>{getDateDisplay()}</h1>

        <Button variant='outline' size='sm' onClick={onToday}>
          오늘
        </Button>
      </div>

      <div className='flex items-center space-x-2'>
        {VIEW_MODE_OPTIONS.map(option => (
          <Button
            key={option.value}
            variant={viewMode === option.value ? 'primary' : 'outline'}
            size='sm'
            onClick={() => onViewModeChange(option.value as ViewMode)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
