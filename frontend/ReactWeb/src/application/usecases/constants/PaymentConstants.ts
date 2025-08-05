// 결제 방법 상수
export const PAYMENT_METHODS = {
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  MOBILE_PAYMENT: 'mobile_payment',
  DIGITAL_WALLET: 'digital_wallet',
} as const;

// 결제 상태 상수
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// 카드 검증 상수
export const CARD_VALIDATION = {
  MIN_CARD_LENGTH: 13,
  MAX_CARD_LENGTH: 19,
  CVV_LENGTH: 3,
  CVV_LENGTH_AMEX: 4,
  EXPIRY_REGEX: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
  CARD_NUMBER_REGEX: /^[0-9\s-]+$/,
} as const;

// 결제 제한 상수
export const PAYMENT_LIMITS = {
  MAX_AMOUNT: 1000000, // 100만원
  MIN_AMOUNT: 1000, // 1천원
  MAX_COUPON_LENGTH: 20,
  MAX_DISCOUNT_PERCENT: 50,
} as const;

// 에러 메시지 상수
export const PAYMENT_ERROR_MESSAGES = {
  VALIDATION: {
    PRODUCT_REQUIRED: '상품을 선택해주세요.',
    PAYMENT_METHOD_REQUIRED: '결제 방법을 선택해주세요.',
    CARD_NUMBER_INVALID: '유효한 카드 번호를 입력해주세요.',
    EXPIRY_INVALID: '올바른 만료일 형식(MM/YY)을 입력해주세요.',
    CVV_INVALID: '유효한 CVV를 입력해주세요.',
    CARD_HOLDER_REQUIRED: '카드 소유자명을 입력해주세요.',
    COUPON_CODE_REQUIRED: '쿠폰 코드를 입력해주세요.',
    AMOUNT_TOO_LOW: '최소 결제 금액은 1,000원입니다.',
    AMOUNT_TOO_HIGH: '최대 결제 금액은 1,000,000원입니다.',
  },
  OPERATION: {
    PRODUCTS_FETCH_FAILED: '구독 상품을 불러오는데 실패했습니다.',
    PAYMENT_METHODS_FETCH_FAILED: '결제 방법을 불러오는데 실패했습니다.',
    COUPON_VALIDATION_FAILED: '쿠폰 검증에 실패했습니다.',
    PAYMENT_PROCESSING_FAILED: '결제 처리에 실패했습니다.',
    INSUFFICIENT_FUNDS: '잔액이 부족합니다.',
    CARD_DECLINED: '카드 결제가 거부되었습니다.',
  },
} as const;

// 캐시 TTL 상수
export const PAYMENT_CACHE_TTL = {
  PRODUCTS: 30 * 60 * 1000, // 30분
  PAYMENT_METHODS: 60 * 60 * 1000, // 1시간
  COUPON_VALIDATION: 5 * 60 * 1000, // 5분
} as const;

// 결제 수수료 상수
export const PAYMENT_FEES = {
  CARD_FEE_PERCENT: 2.5,
  BANK_TRANSFER_FEE: 0,
  MOBILE_PAYMENT_FEE_PERCENT: 1.0,
  DIGITAL_WALLET_FEE_PERCENT: 0.5,
} as const; 