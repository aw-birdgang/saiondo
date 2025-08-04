import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Badge,
  LoadingSpinner
} from '../common';
import { cn } from '../../../utils/cn';
import type { SubscriptionProduct } from '../../../domain/types/payment';

interface ProductSelectionStepProps {
  products: SubscriptionProduct[];
  isLoading: boolean;
  error: string | null;
  onProductSelect: (product: SubscriptionProduct) => void;
  onRetry: () => void;
}

export const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({
  products,
  isLoading,
  error,
  onProductSelect,
  onRetry
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="구독 상품을 불러오는 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-txt mb-2">상품 로딩 오류</h2>
          <p className="text-txt-secondary mb-4">{error}</p>
          <Button onClick={onRetry}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-txt mb-2">구독 플랜 선택</h1>
        <p className="text-txt-secondary">원하는 플랜을 선택하고 결제를 진행하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className={cn(
              'cursor-pointer transition-all duration-200 hover:shadow-lg',
              product.popular && 'ring-2 ring-primary'
            )}
            onClick={() => onProductSelect(product)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{product.title}</CardTitle>
                {product.popular && (
                  <Badge variant="default">인기</Badge>
                )}
              </div>
              <p className="text-txt-secondary">{product.description}</p>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-txt">{product.price}</div>
                {product.originalPrice && (
                  <div className="text-txt-secondary line-through">{product.originalPrice}</div>
                )}
                {product.discount && (
                  <Badge variant="success" className="mt-2">{product.discount}</Badge>
                )}
              </div>
              
              <ul className="space-y-2 mb-4">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-txt">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant="primary" fullWidth>
                선택하기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 