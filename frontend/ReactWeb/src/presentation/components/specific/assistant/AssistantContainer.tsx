import React from 'react';
import { Container } from '@/presentation/components/common';
import { cn } from '@/utils/cn';

interface AssistantContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AssistantContainer: React.FC<AssistantContainerProps> = ({
  children,
  className,
}) => {
  return (
    <Container
      variant='page'
      className={cn('min-h-screen bg-background', className)}
    >
      {children}
    </Container>
  );
};

export default AssistantContainer;
