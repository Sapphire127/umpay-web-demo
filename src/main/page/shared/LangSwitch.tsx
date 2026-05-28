import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-CN', label: '中文' },
];

export default function LangSwitch() {
  const { i18n } = useTranslation();

  return (
    <Select
      size="small"
      value={i18n.language}
      onChange={(val) => i18n.changeLanguage(val)}
      options={LANGUAGES}
      popupMatchSelectWidth={false}
      variant="borderless"
    />
  );
}
