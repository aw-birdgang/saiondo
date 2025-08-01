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
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`appearance-none relative block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm`}
      >
        <option value="">{placeholder || t('select_option')}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
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