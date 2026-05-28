import { useEffect } from 'react';
import type { FormInstance } from 'antd';

export const useFormI18n = (form: FormInstance, language: string): void => {
  useEffect(() => {
    const fieldsWithErrors = form.getFieldsError()
      .filter((f) => f.errors.length > 0)
      .map((f) => f.name);
    if (fieldsWithErrors.length > 0) {
      form.validateFields(fieldsWithErrors);
    }
  }, [language, form]);
};
