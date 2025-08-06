import React from 'react';
import { cn } from '@/utils/cn';

interface BackgroundPatternProps {
  className?: string;
  opacity?: number;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  className = '',
  opacity = 5,
}) => {
  return (
    <div
      className={cn('absolute inset-0', className)}
      style={{ opacity: opacity / 100 }}
    >
      <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transform rotate-12 scale-150'></div>
    </div>
  );
};

export default BackgroundPattern;
