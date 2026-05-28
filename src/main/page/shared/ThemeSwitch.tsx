import { useThemeStore } from '@/stores/themeStore';

export default function ThemeSwitch() {
  const { isDark, toggle } = useThemeStore();

  return (
    <button className="themeBtn" onClick={toggle}>
      {isDark ? '☀' : '☾'}
    </button>
  );
}
