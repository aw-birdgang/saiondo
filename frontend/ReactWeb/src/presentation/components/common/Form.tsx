import React from 'react';
import { useTranslation } from 'react-i18next';
import FormField from './FormField';
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

  const renderField = (field: FormField) => (
    <FormField
      key={field.name}
      name={field.name}
      type={field.type}
      label={field.label}
      placeholder={field.placeholder}
      required={field.required}
      autoComplete={field.autoComplete}
      options={field.options}
      value={values[field.name] || ''}
      error={errors[field.name]}
      onChange={onChange}
    />
  );

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