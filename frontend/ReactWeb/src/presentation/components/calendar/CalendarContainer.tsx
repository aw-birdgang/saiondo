import React from 'react';
import { cn } from '@/utils/cn';
import type { CalendarContainerProps } from '@/presentation/pages/calendar/types/calendarTypes';

const CalendarContainer: React.FC<CalendarContainerProps> = ({
  children,
  className,
}) => {
  return <div className={cn('flex-1 p-6', className)}>{children}</div>;
};

export default CalendarContainer;
