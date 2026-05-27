import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import Logo from '@/assets/logo.svg?react';
import './LoginPage.scss';

function LoginPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { login, isLoading, errorMsg } = useAuthStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');

  const handleLogin = async () => {
    await login({ username, password, totpCode: totpCode || undefined });
    if (useAuthStore.getState().token) {
      navigate('/dashboard', { replace: true });
    }
  };

  const switchLang = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="loginPage">
      <div className="headerBar">
        <div className="langGroup">
          <button
            className={`langBtn ${i18n.language === 'zh-CN' ? 'active' : ''}`}
            onClick={() => switchLang('zh-CN')}
          >
            中
          </button>
          <button
            className={`langBtn ${i18n.language === 'en-US' ? 'active' : ''}`}
            onClick={() => switchLang('en-US')}
          >
            EN
          </button>
        </div>
        <div className="headerSplit" />
        <button className="themeBtn" onClick={toggleTheme}>
          {isDark ? '☀' : '☾'}
        </button>
      </div>

      <div className="loginCard">
        <div className="logoArea">
          <div className="logoIcon">
            <Logo />
          </div>
          <div className="logoWordmark">UMPay</div>
        </div>

        <Typography.Title level={4} className="loginTitle">
          {t('login.title')}
        </Typography.Title>

        <div className="formGroup">
          <label className="formLabel">{t('login.username')}</label>
          <Input
            size="large"
            placeholder={t('login.usernamePlaceholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={handleLogin}
          />
        </div>

        <div className="formGroup">
          <label className="formLabel">{t('login.password')}</label>
          <Input.Password
            size="large"
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleLogin}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </div>

        <div className="formGroup">
          <label className="formLabel">{t('login.totp')}</label>
          <Input
            size="large"
            placeholder={t('login.totpPlaceholder')}
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            onPressEnter={handleLogin}
            maxLength={6}
          />
        </div>

        {errorMsg && <div className="formError">{errorMsg}</div>}

        <Button
          type="primary"
          size="large"
          block
          loading={isLoading}
          onClick={handleLogin}
          className="loginButton"
        >
          {t('login.submit')}
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
