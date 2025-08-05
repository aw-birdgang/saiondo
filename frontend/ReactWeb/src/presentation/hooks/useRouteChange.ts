import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UseRouteChangeOptions {
  onRouteChange?: (pathname: string) => void;
  onRouteEnter?: (pathname: string) => void;
  onRouteLeave?: (pathname: string) => void;
}

export const useRouteChange = (options: UseRouteChangeOptions = {}) => {
  const { pathname } = useLocation();
  const { onRouteChange, onRouteEnter, onRouteLeave } = options;

  useEffect(() => {
    onRouteChange?.(pathname);
  }, [pathname, onRouteChange]);

  useEffect(() => {
    onRouteEnter?.(pathname);
  }, [pathname, onRouteEnter]);

  useEffect(() => {
    return () => {
      onRouteLeave?.(pathname);
    };
  }, [pathname, onRouteLeave]);

  return {
    currentPath: pathname,
  };
};
