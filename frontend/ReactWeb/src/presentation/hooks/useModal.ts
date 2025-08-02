import { useEffect } from 'react';

interface UseModalOptions {
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  preventScroll?: boolean;
}

export const useModal = (
  isOpen: boolean,
  onClose: () => void,
  options: UseModalOptions = {}
) => {
  const {
    closeOnEscape = true,
    closeOnOverlayClick = true,
    preventScroll = true
  } = options;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      if (closeOnEscape) {
        document.addEventListener('keydown', handleEscape);
      }
      
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      if (closeOnEscape) {
        document.removeEventListener('keydown', handleEscape);
      }
      
      if (preventScroll) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, onClose, closeOnEscape, preventScroll]);

  return {
    closeOnOverlayClick,
  };
}; 