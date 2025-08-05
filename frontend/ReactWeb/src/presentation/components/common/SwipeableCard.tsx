import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../../utils/cn';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;

      const touch = e.touches[0];
      setStartX(touch.clientX);
      setStartY(touch.clientY);
      setCurrentX(touch.clientX);
      setCurrentY(touch.clientY);
      setIsDragging(true);
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !isDragging) return;

      const touch = e.touches[0];
      setCurrentX(touch.clientX);
      setCurrentY(touch.clientY);
    },
    [disabled, isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    if (disabled || !isDragging) return;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine swipe direction
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }

    setIsDragging(false);
    setCurrentX(0);
    setCurrentY(0);
  }, [
    disabled,
    isDragging,
    currentX,
    currentY,
    startX,
    startY,
    threshold,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  ]);

  // Mouse events for desktop
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      setStartX(e.clientX);
      setStartY(e.clientY);
      setCurrentX(e.clientX);
      setCurrentY(e.clientY);
      setIsDragging(true);
    },
    [disabled]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (disabled || !isDragging) return;

      setCurrentX(e.clientX);
      setCurrentY(e.clientY);
    },
    [disabled, isDragging]
  );

  const handleMouseUp = useCallback(() => {
    if (disabled || !isDragging) return;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }

    setIsDragging(false);
    setCurrentX(0);
    setCurrentY(0);
  }, [
    disabled,
    isDragging,
    currentX,
    currentY,
    startX,
    startY,
    threshold,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  ]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const deltaX = currentX - startX;
  const deltaY = currentY - startY;

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative cursor-grab active:cursor-grabbing transition-transform duration-200',
        isDragging && 'cursor-grabbing',
        className
      )}
      style={{
        transform: isDragging
          ? `translate(${deltaX}px, ${deltaY}px)`
          : 'translate(0, 0)',
        zIndex: isDragging ? 10 : 1,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {children}

      {/* Swipe indicator */}
      {isDragging && (
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute inset-0 bg-primary/5 rounded-lg' />
          {Math.abs(deltaX) > Math.abs(deltaY) && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-1 h-8 rounded-full transition-all duration-200',
                deltaX > 0 ? 'right-2 bg-green-500' : 'left-2 bg-red-500'
              )}
            />
          )}
          {Math.abs(deltaY) > Math.abs(deltaX) && (
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 w-8 h-1 rounded-full transition-all duration-200',
                deltaY > 0 ? 'bottom-2 bg-blue-500' : 'top-2 bg-yellow-500'
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Convenience component for swipeable list items
export const SwipeableListItem: React.FC<{
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  className?: string;
}> = ({ children, onDelete, onEdit, className }) => {
  return (
    <SwipeableCard
      onSwipeLeft={onDelete}
      onSwipeRight={onEdit}
      className={cn(
        'bg-surface border border-border rounded-lg p-4',
        className
      )}
    >
      {children}
    </SwipeableCard>
  );
};

SwipeableCard.displayName = 'SwipeableCard';
