import React from 'react';

interface InputProps {
  id?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  autoComplete,
  className = '',
  onKeyPress,
}) => {
  const inputId = id || name;
  const hasError = !!error;

  const baseClasses = 'input';
  const errorClasses = hasError ? 'error' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={inputClasses}
      />
      {hasError && (
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-error rounded-full"></div>
          <p className="text-sm text-error">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Input; 