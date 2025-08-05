import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  className?: string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`card p-6 mb-8 ${className}`}>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-txt leading-tight'>
          {t('calendar') || '캘린더'}
        </h2>
        <button
          onClick={onToday}
          className='btn btn-primary px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105'
        >
          {t('today') || '오늘'}
        </button>
      </div>

      {/* Month Navigation */}
      <div className='flex items-center justify-between'>
        <button
          onClick={onPreviousMonth}
          className='p-3 hover:bg-secondary rounded-lg transition-all duration-200 hover:scale-105'
        >
          <svg
            className='w-6 h-6 text-txt-secondary'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>

        <h3 className='text-xl font-semibold text-txt leading-tight'>
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h3>

        <button
          onClick={onNextMonth}
          className='p-3 hover:bg-secondary rounded-lg transition-all duration-200 hover:scale-105'
        >
          <svg
            className='w-6 h-6 text-txt-secondary'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
