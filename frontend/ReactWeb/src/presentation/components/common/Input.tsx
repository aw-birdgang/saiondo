import React, { forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../shared/utils/cn';
import { getAriaAttributes } from '../../../shared/design-system/accessibility';

const inputVariants = cva(
  'flex w-full rounded-lg border bg-surface text-txt placeholder:text-txt-secondary transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-txt placeholder:text-txt-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 group',
  {
    variants: {
      variant: {
        default:
          'border-border focus-visible:border-primary focus-visible:ring-primary',
        error: 'border-error focus-visible:ring-error',
        success: 'border-green-500 focus-visible:ring-green-500',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
        glass:
          'bg-white/20 backdrop-blur-md border-white/30 focus:border-white/50 focus:ring-white/50',
        neu:
          'bg-gray-100 shadow-inner border-0 dark:bg-gray-800 focus:ring-2 focus:ring-primary/50',
        modern:
          'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 py-3 text-base',
      },
      state: {
        default: '',
        focused: 'border-primary ring-2 ring-primary/20',
        error: 'border-error ring-2 ring-error/20',
        success: 'border-green-500 ring-2 ring-green-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  required?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  animated?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      state,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      required = false,
      showCharacterCount = false,
      maxLength,
      animated = true,
      id,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState(props.value || props.defaultValue || '');
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    const currentState = error ? 'error' : isFocused ? 'focused' : 'default';

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-txt transition-colors duration-200',
              animated && 'group-focus-within:text-primary',
              error && 'text-error'
            )}
          >
            {label}
            {required && <span className='text-error ml-1'>*</span>}
          </label>
        )}
        <div className='relative group'>
          {leftIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 text-txt-secondary transition-all duration-200',
                animated &&
                  'group-focus-within:text-primary group-focus-within:scale-110'
              )}
            >
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              inputVariants({
                variant: error ? 'error' : variant,
                size,
                state: currentState,
              }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              animated && 'hover:border-primary/50',
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={maxLength}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-txt-secondary transition-all duration-200',
                animated &&
                  'group-focus-within:text-primary group-focus-within:scale-110'
              )}
            >
              {rightIcon}
            </div>
          )}

          {/* Focus indicator */}
          {animated && isFocused && (
            <div className='absolute inset-0 rounded-lg ring-2 ring-primary/20 pointer-events-none animate-pulse' />
          )}
        </div>

        {/* Helper text and error */}
        {(error || helperText || (showCharacterCount && maxLength)) && (
          <div className='flex items-center justify-between text-sm'>
            <div className='flex-1'>
              {error && (
                <p
                  id={`${inputId}-error`}
                  className='text-error flex items-center'
                >
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {error}
                </p>
              )}
              {helperText && !error && (
                <p id={`${inputId}-helper`} className='text-txt-secondary'>
                  {helperText}
                </p>
              )}
            </div>
            {showCharacterCount && maxLength && (
              <span
                className={cn(
                  'text-xs transition-colors duration-200',
                  String(value).length > maxLength * 0.9
                    ? 'text-error'
                    : 'text-txt-secondary'
                )}
              >
                {String(value).length}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
