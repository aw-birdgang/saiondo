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
    <div className={`min-h-screen bg-bg ${className}`}>
      {children}
    </div>
  );
};

export default InvitationPageContainer; 