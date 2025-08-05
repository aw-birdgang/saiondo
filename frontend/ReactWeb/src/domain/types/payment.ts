export interface SubscriptionProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  features: string[];
  popular?: boolean;
  period?: 'monthly' | 'yearly';
  points?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  isAvailable: boolean;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  isValid: boolean;
  expiresAt?: string;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export interface PaymentStep {
  id: 'product' | 'payment' | 'confirmation' | 'processing' | 'complete';
  title: string;
  description: string;
  progress: number;
}

export interface PaymentState {
  currentStep: PaymentStep['id'];
  selectedProduct: SubscriptionProduct | null;
  selectedPaymentMethod: string;
  couponCode: string;
  appliedCoupon: Coupon | null;
  cardDetails: CardDetails;
  isProcessing: boolean;
  paymentProgress: number;
  error: string | null;
}

export interface PaymentRequest {
  productId: string;
  paymentMethod: string;
  couponCode?: string;
  cardDetails?: CardDetails;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  error?: string;
}

export interface PaymentValidationError {
  field: string;
  message: string;
}
