import React from 'react';

interface PaymentContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PaymentContentContainer: React.FC<PaymentContentContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`max-w-6xl mx-auto px-6 py-8 ${className}`}>
      {children}
    </div>
  );
};

export default PaymentContentContainer; 