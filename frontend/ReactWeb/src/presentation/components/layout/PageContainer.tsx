import React from 'react';
import { Container } from '@/presentation/components/common';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = '4xl',
  padding = 'md',
  className = '',
}) => {
  return (
    <Container
      variant='content'
      maxWidth={maxWidth}
      padding={padding}
      className={className}
    >
      {children}
    </Container>
  );
};

export default PageContainer;
