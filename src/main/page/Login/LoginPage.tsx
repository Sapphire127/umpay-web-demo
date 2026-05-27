import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import Logo from '@/assets/logo.svg?react';
import './LoginPage.scss';

function LoginPage() {
  const navigate = useNavigate();
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

  return (
    <div className="loginPage">
      <div className="headerBar">
        <div className="langGroup">
          <button className="langBtn active">中</button>
          <button className="langBtn">EN</button>
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

        <Typography.Title level={4} className="loginTitle">管理员登录</Typography.Title>

        <div className="formGroup">
          <label className="formLabel">用户名</label>
          <Input
            size="large"
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={handleLogin}
          />
        </div>

        <div className="formGroup">
          <label className="formLabel">密码</label>
          <Input.Password
            size="large"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleLogin}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </div>

        <div className="formGroup">
          <label className="formLabel">TOTP 验证码（选填）</label>
          <Input
            size="large"
            placeholder="如未启用两步验证，留空即可"
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
          登录
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
