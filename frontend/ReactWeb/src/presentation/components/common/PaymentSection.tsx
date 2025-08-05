import React from 'react';

interface PaymentSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  children,
  className = '',
  title,
}) => {
  return (
    <section
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      {title && (
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
          {title}
        </h3>
      )}
      {children}
    </section>
  );
};

export default PaymentSection;
