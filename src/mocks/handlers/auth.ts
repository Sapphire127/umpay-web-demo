import { http, HttpResponse } from 'msw';

interface LoginBody {
  username: string;
  password: string;
  totpCode?: string;
}

const MOCK_USERS: Record<string, { password: string; totpSecret: string | null }> = {
  admin: { password: 'admin123', totpSecret: null },
  operator: { password: 'oper123', totpSecret: '123456' },
};

const AUTH_CREDENTIALS_ERROR = 1001;

export const authHandlers = [
  http.post('/api/v1/admin/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginBody;

    const user = MOCK_USERS[body.username];
    if (!user || user.password !== body.password) {
      return HttpResponse.json(
        { code: AUTH_CREDENTIALS_ERROR, message: '用户名或密码错误', data: null },
        { status: 401 }
      );
    }

    if (user.totpSecret) {
      if (!body.totpCode || body.totpCode !== user.totpSecret) {
        return HttpResponse.json(
          { code: AUTH_CREDENTIALS_ERROR, message: 'Invalid TOTP code', data: null },
          { status: 401 }
        );
      }
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        accessToken: `mock-jwt-${body.username}-${Date.now()}`,
        expiresIn: 7200,
      },
    });
  }),
];
