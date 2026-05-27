export interface LoginRequest {
  username: string;
  password: string;
  totpCode?: string;
}

