import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from './Input';

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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  className?: string;
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
}) => {
  const { t } = useTranslation();

  const renderSelectField = () => (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-txt">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`input ${error ? 'error' : ''}`}
      >
        <option value="">{placeholder || t('select_option') || '옵션을 선택하세요'}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-error rounded-full"></div>
          <p className="text-sm text-error">{error}</p>
        </div>
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
      required={required}
      autoComplete={autoComplete}
      className={className}
    />
  );

  return type === 'select' ? renderSelectField() : renderInputField();
};

export default FormField; 