export const getMaxWidthClasses = () =>
  ({
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  }) as const;

export type MaxWidth = keyof ReturnType<typeof getMaxWidthClasses>;
