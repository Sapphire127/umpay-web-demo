import { useTranslation } from 'react-i18next';

export const useFormRules = () => {
  const { t } = useTranslation();

  return {
    username: [{ required: true, message: t('login.usernameRequired') }],
    password: [{ required: true, message: t('login.passwordRequired') }],
    totpCode: [{ pattern: /^\d{6}$/, message: t('login.totpInvalidRule') }],
  };
};
