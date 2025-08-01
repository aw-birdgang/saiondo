import React from 'react';

interface TextAreaProps {
  id?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  rows = 3,
  maxLength,
  className = '',
  onKeyPress,
}) => {
  const textareaId = id || name;
  const hasError = !!error;

  const baseClasses = 'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 sm:text-sm resize-none';
  const borderClasses = hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500';
  const disabledClasses = disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '';

  const textareaClasses = `${baseClasses} ${borderClasses} ${disabledClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default TextArea; 