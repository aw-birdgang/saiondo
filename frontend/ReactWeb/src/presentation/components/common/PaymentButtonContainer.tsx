import React from 'react';

interface PaymentButtonContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PaymentButtonContainer: React.FC<PaymentButtonContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mt-6 text-center ${className}`}>
      {children}
    </div>
  );
};

export default PaymentButtonContainer; 