import React from 'react';
import { SplashScreen } from './splash';

interface SplashContainerProps {
  appName: string;
  loadingMessage: string;
  onAnimationComplete?: () => void;
  className?: string;
}

const SplashContainer: React.FC<SplashContainerProps> = ({
  appName,
  loadingMessage,
  onAnimationComplete,
}) => {
  return (
    <SplashScreen
      appName={appName}
      loadingMessage={loadingMessage}
      onAnimationComplete={onAnimationComplete}
    />
  );
};

export default SplashContainer;
