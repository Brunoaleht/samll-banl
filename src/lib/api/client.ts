const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw { status: response.status, ...error };
    }

    return response.json();
  }

  async login(username: string, password: string): Promise<{ token: string }> {
    return this.request<{ token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, pass: password }),
    });
  }

  async reset(): Promise<void> {
    return this.request<void>('/reset', {
      method: 'POST',
    });
  }

  async getBalance(accountId: string): Promise<{ balance: number }> {
    return this.request<{ balance: number }>(`/balance?account_id=${accountId}`, {
      method: 'GET',
    });
  }

  async deposit(destination: string, amount: number): Promise<{
    destination: { id: string; balance: number };
  }> {
    return this.request<{ destination: { id: string; balance: number } }>('/event', {
      method: 'POST',
      body: JSON.stringify({
        type: 'deposit',
        destination,
        amount,
      }),
    });
  }

  async withdraw(origin: string, amount: number): Promise<{
    origin: { id: string; balance: number };
  }> {
    return this.request<{ origin: { id: string; balance: number } }>('/event', {
      method: 'POST',
      body: JSON.stringify({
        type: 'withdraw',
        origin,
        amount,
      }),
    });
  }

  async transfer(
    origin: string,
    destination: string,
    amount: number
  ): Promise<{
    origin: { id: string; balance: number };
    destination: { id: string; balance: number };
  }> {
    return this.request<{
      origin: { id: string; balance: number };
      destination: { id: string; balance: number };
    }>('/event', {
      method: 'POST',
      body: JSON.stringify({
        type: 'transfer',
        origin,
        destination,
        amount,
      }),
    });
  }
}

export const apiClient = new ApiClient();

