import { useState, useEffect } from 'react';

interface UseFormInitializationOptions<T> {
  initialData?: T;
  defaultData: T;
  dependencies?: any[];
  onDataChange?: (data: T) => void;
}

export const useFormInitialization = <T>(
  options: UseFormInitializationOptions<T>
) => {
  const { initialData, defaultData, dependencies = [], onDataChange } = options;

  const [formData, setFormData] = useState<T>(initialData || defaultData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultData);
    }
    onDataChange?.(initialData || defaultData);
  }, [initialData, defaultData, onDataChange, ...dependencies]);

  const updateFormData = (updates: Partial<T>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onDataChange?.(newData);
  };

  const resetForm = () => {
    const resetData = initialData || defaultData;
    setFormData(resetData);
    onDataChange?.(resetData);
  };

  return {
    formData,
    setFormData,
    updateFormData,
    resetForm,
  };
};
