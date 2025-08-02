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

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-txt">
          {label}
          {required && <span className="text-error ml-1">*</span>}
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
        className={`
          input resize-none transition-all duration-200
          ${hasError ? 'border-error focus:ring-error/20 focus:border-error' : ''}
          ${disabled ? 'bg-secondary cursor-not-allowed' : ''}
          ${className}
        `}
      />
      {hasError && (
        <p className="text-sm text-error flex items-center">
          <span className="w-1 h-1 bg-error rounded-full mr-2"></span>
          {error}
        </p>
      )}
      {maxLength && (
        <p className="text-xs text-txt-secondary text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default TextArea; 