const AUTH_API_URL = 'https://functions.poehali.dev/feeb1c64-e0bd-49f0-85dd-f32b777141fd';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  referral_code: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
  code?: string;
}

export const authService = {
  async register(
    email: string,
    password: string,
    phone: string,
    name: string,
    referralCode?: string
  ): Promise<AuthResponse> {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'register',
        email,
        password,
        phone,
        name,
        referral_code: referralCode,
      }),
    });

    return response.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email,
        password,
      }),
    });

    return response.json();
  },

  async getProfile(token: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_API_URL, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token,
      },
    });

    return response.json();
  },

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser(): void {
    localStorage.removeItem('user');
  },

  logout(): void {
    this.removeToken();
    this.removeUser();
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
