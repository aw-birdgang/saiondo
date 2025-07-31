import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from './Input';
import Button from './Button';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  options?: { value: string; label: string }[];
}

interface FormProps {
  fields: FormField[];
  values: { [key: string]: string };
  errors: { [key: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  loading?: boolean;
  className?: string;
}

const Form: React.FC<FormProps> = ({
  fields,
  values,
  errors,
  onChange,
  onSubmit,
  submitText,
  loading = false,
  className = '',
}) => {
  const { t } = useTranslation();

  const renderField = (field: FormField) => {
    if (field.type === 'select') {
      return (
        <div key={field.name} className="space-y-1">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            id={field.name}
            name={field.name}
            value={values[field.name] || ''}
            onChange={onChange}
            required={field.required}
            className={`appearance-none relative block w-full px-3 py-2 border ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            } text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm`}
          >
            <option value="">{field.placeholder || t('select_option')}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
          )}
        </div>
      );
    }

    return (
      <Input
        key={field.name}
        name={field.name}
        type={field.type}
        value={values[field.name] || ''}
        onChange={onChange}
        placeholder={field.placeholder}
        label={field.label}
        error={errors[field.name]}
        required={field.required}
        autoComplete={field.autoComplete}
      />
    );
  };

  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        {fields.map(renderField)}
      </div>
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {submitText || t('submit')}
      </Button>
    </form>
  );
};

export default Form; 