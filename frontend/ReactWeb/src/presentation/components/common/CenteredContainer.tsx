import React from 'react';
import Container from './Container';

interface CenteredContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CenteredContainer: React.FC<CenteredContainerProps> = ({
  children,
  maxWidth = '4xl',
  padding = 'md',
  className = '',
}) => {
  return (
    <Container
      variant='centered'
      maxWidth={maxWidth}
      padding={padding}
      className={className}
    >
      {children}
    </Container>
  );
};

export default CenteredContainer;
