import React from 'react';

interface PaymentMethodSectionProps {
  children: React.ReactNode;
  className?: string;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  children,
  className = '',
}) => {
  return <div className={`mt-8 ${className}`}>{children}</div>;
};

export default PaymentMethodSection;
