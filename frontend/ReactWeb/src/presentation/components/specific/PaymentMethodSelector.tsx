import React, { useState } from 'react';
import { PaymentMethodCard, EmptyState } from '../common';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  isAvailable: boolean;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod?: string;
  onMethodSelect: (methodId: string) => void;
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedMethod,
  onMethodSelect,
  className = ''
}) => {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const handleMethodClick = (method: PaymentMethod) => {
    if (!method.isAvailable) return;
    
    if (expandedMethod === method.id) {
      setExpandedMethod(null);
    } else {
      setExpandedMethod(method.id);
      onMethodSelect(method.id);
    }
  };

  if (methods.every(method => !method.isAvailable)) {
    return (
      <EmptyState
        icon="💳"
        title="결제 방법 없음"
        description="현재 사용 가능한 결제 방법이 없습니다."
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        결제 방법 선택
      </h3>
      
      {methods.map((method) => (
        <PaymentMethodCard
          key={method.id}
          method={method}
          isSelected={selectedMethod === method.id}
          isExpanded={expandedMethod === method.id}
          onClick={() => handleMethodClick(method)}
        />
      ))}
    </div>
  );
};

export default PaymentMethodSelector; 