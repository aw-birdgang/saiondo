import React from 'react';
import { Container } from '@/presentation/components/common';
import { cn } from '@/utils/cn';

interface AuthContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  className,
}) => {
  return (
    <Container
      variant='page'
      maxWidth='md'
      className={cn('max-w-md w-full space-y-8', className)}
    >
      {children}
    </Container>
  );
};

export default AuthContainer;
