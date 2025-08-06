import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from './';
import { cn } from '@/utils/cn';

interface FormFieldOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  name: string;
  type: 'text' | 'email' | 'password' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  options?: FormFieldOption[];
  value: string;
  error?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  className?: string;
  helperText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  type,
  label,
  placeholder,
  required = false,
  autoComplete,
  options,
  value,
  error,
  onChange,
  className = '',
  helperText,
}) => {
  const { t } = useTranslation();

  const renderSelectField = () => (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className='block text-sm font-medium text-txt'>
        {label}
        {required && <span className='text-error ml-1'>*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={cn(
          'flex w-full rounded-lg border bg-surface text-txt placeholder:text-txt-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 px-4 py-3 text-sm',
          error ? 'border-error focus-visible:ring-error' : 'border-border'
        )}
      >
        <option value=''>
          {placeholder || t('select_option') || '옵션을 선택하세요'}
        </option>
        {options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p
          className={cn('text-sm', error ? 'text-error' : 'text-txt-secondary')}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );

  const renderInputField = () => (
    <Input
      name={name}
      type={type === 'select' ? 'text' : type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      autoComplete={autoComplete}
      className={className}
    />
  );

  return type === 'select' ? renderSelectField() : renderInputField();
};

export default FormField;
