import React from 'react';

interface LoginPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LoginPageContainer: React.FC<LoginPageContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`max-w-md w-full space-y-8 ${className}`}>
      {children}
    </div>
  );
};

export default LoginPageContainer; 