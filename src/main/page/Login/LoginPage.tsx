import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useFormRules } from './useFormRules';
import { useFormI18n } from '@/page/shared/useFormI18n';
import LangSwitch from '@/page/shared/LangSwitch';
import Logo from '@/assets/logo.svg?react';
import './LoginPage.scss';

interface LoginFormValues {
  username: string;
  password: string;
  totpCode?: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { login, isLoading } = useAuthStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const rules = useFormRules();

  const [form] = Form.useForm<LoginFormValues>();
  useFormI18n(form, i18n.language);

  const handleFinish = async (values: LoginFormValues) => {
    try {
      await login(values);
      message.success(t('login.success'));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      message.error(err instanceof Error ? err.message : t('login.error.default'));
    }
  };

  return (
    <div className="loginPage">
      <div className="headerBar">
        <LangSwitch />
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

        <Form form={form} onFinish={handleFinish} layout="vertical" size="large">
          <Form.Item
            name="username"
            label={t('login.username')}
            rules={rules.username}
          >
            <Input placeholder={t('login.usernamePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('login.password')}
            rules={rules.password}
          >
            <Input.Password
              placeholder={t('login.passwordPlaceholder')}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="totpCode"
            label={t('login.totp')}
            rules={rules.totpCode}
          >
            <Input placeholder={t('login.totpPlaceholder')} maxLength={6} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
            className="loginButton"
          >
            {t('login.submit')}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
