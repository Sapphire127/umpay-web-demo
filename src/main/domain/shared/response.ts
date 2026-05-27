export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export function handleError(error: unknown): void {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status: number; data?: { message?: string } } };
    const status = axiosError.response?.status;
    const msg = axiosError.response?.data?.message;

    switch (status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        console.error('无权限:', msg);
        break;
      default:
        console.error('请求失败:', msg || '未知错误');
    }
  }
}
