import React from 'react';
import { useTranslation } from 'react-i18next';
import FormField from '@/presentation/components/common/FormField';
import { Button } from './';
import { useToastContext } from '@/presentation/providers/ToastProvider';

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
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  loading?: boolean;
  className?: string;
  successMessage?: string;
  errorMessage?: string;
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
  successMessage = '성공적으로 처리되었습니다.',
  errorMessage = '오류가 발생했습니다. 다시 시도해주세요.',
}) => {
  const { t } = useTranslation();
  const toast = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      toast.error('입력 정보를 확인해주세요.');
      return;
    }

    try {
      await onSubmit(e);
      toast.success(successMessage);
    } catch (error) {
      toast.error(errorMessage);
    }
  };

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
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className='space-y-4'>{fields.map(renderField)}</div>
      <Button
        type='submit'
        variant='primary'
        fullWidth
        loading={loading}
        disabled={loading}
        className='py-3 text-base font-semibold'
      >
        {submitText || t('submit') || '제출'}
      </Button>
    </form>
  );
};

export default Form;
