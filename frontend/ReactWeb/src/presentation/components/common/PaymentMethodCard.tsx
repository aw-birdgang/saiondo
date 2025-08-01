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
        border rounded-lg p-4 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }
        ${!method.isAvailable 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-sm'
        }
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{method.icon}</div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {method.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {method.description}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!method.isAvailable && (
            <span className="text-xs text-red-500 dark:text-red-400">
              사용 불가
            </span>
          )}
          
          {isSelected && (
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </div>
      </div>
      
      {/* Additional details when expanded */}
      {isExpanded && method.isAvailable && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {method.name}로 결제하시면 즉시 구독이 활성화됩니다.
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard; 