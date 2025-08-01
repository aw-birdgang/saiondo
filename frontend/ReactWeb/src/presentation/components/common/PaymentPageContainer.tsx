import React from 'react';

interface PaymentPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PaymentPageContainer: React.FC<PaymentPageContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {children}
    </div>
  );
};

export default PaymentPageContainer; 