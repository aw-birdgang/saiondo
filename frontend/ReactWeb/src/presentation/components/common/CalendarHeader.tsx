import React from 'react';

interface CalendarHeaderProps {
  className?: string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ className = '' }) => {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className={`grid grid-cols-7 gap-1 ${className}`}>
      {daysOfWeek.map(day => (
        <div
          key={day}
          className='p-3 text-center text-sm font-semibold text-txt-secondary bg-secondary/50 rounded-lg'
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default CalendarHeader;
