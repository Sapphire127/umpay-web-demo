import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  return <div>{t('dashboard.title')}</div>;
}
