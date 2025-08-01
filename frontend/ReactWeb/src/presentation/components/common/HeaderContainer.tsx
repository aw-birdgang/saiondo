import React from 'react';

interface HeaderContainerProps {
  children: React.ReactNode;
  className?: string;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default HeaderContainer; 