import React from 'react';

interface InvitationGridProps {
  children: React.ReactNode;
  className?: string;
}

const InvitationGrid: React.FC<InvitationGridProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default InvitationGrid;
