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
    <div className={`min-h-screen bg-gray-50 dark:bg-dark-surface ${className}`}>
      {children}
    </div>
  );
};

export default PaymentPageContainer; 