import React from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-6 mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('calendar')}
        </h2>
        <button
          onClick={onToday}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('today')}
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h3>

        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader; 