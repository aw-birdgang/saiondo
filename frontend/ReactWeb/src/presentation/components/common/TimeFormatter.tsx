import React from 'react';

interface TimeFormatterProps {
  date: Date;
  format?: 'relative' | 'absolute' | 'short';
  className?: string;
}

const TimeFormatter: React.FC<TimeFormatterProps> = ({
  date,
  format = 'relative',
  className = ''
}) => {
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString();
  };

  const formatAbsoluteTime = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortTime = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFormattedTime = () => {
    switch (format) {
      case 'absolute':
        return formatAbsoluteTime(date);
      case 'short':
        return formatShortTime(date);
      default:
        return formatRelativeTime(date);
    }
  };

  return (
    <time 
      dateTime={date.toISOString()} 
      className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
    >
      {getFormattedTime()}
    </time>
  );
};

export default TimeFormatter; 