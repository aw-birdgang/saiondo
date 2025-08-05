import React from 'react';
import { ProductCard } from './payment';

interface SubscriptionProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  features: string[];
  popular?: boolean;
}

interface ProductGridProps {
  products: SubscriptionProduct[];
  onPurchase: (product: SubscriptionProduct) => void;
  purchasePending: boolean;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onPurchase,
  purchasePending,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}
    >
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onPurchase={onPurchase}
          loading={purchasePending}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
