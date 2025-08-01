import React from 'react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  isAvailable: boolean;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  isExpanded: boolean;
  onClick: () => void;
  className?: string;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isSelected,
  isExpanded,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`
        card p-6 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-primary bg-primary/5 shadow-lg' 
          : 'border-border hover:border-primary/30 hover:shadow-md'
        }
        ${!method.isAvailable 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-[1.02]'
        }
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-3xl">{method.icon}</div>
          <div className="flex-1">
            <div className="font-semibold text-text text-lg">
              {method.name}
            </div>
            <div className="text-sm text-text-secondary mt-1">
              {method.description}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!method.isAvailable && (
            <span className="text-xs text-error font-medium px-2 py-1 bg-error/10 rounded-full">
              사용 불가
            </span>
          )}
          
          {isSelected && (
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-on-primary rounded-full" />
            </div>
          )}
        </div>
      </div>
      
      {/* Additional details when expanded */}
      {isExpanded && method.isAvailable && (
        <div className="mt-6 pt-4 border-t border-divider">
          <div className="text-sm text-text-secondary leading-relaxed">
            {method.name}로 결제하시면 즉시 구독이 활성화됩니다.
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard; 