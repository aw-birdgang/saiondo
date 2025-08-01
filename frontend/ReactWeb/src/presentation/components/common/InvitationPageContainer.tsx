import React from 'react';

interface InvitationPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const InvitationPageContainer: React.FC<InvitationPageContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-dark-surface ${className}`}>
      {children}
    </div>
  );
};

export default InvitationPageContainer; 