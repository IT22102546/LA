const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiClient {
  private static getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...baseHeaders,
        ...(options.headers as Record<string, string>),
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'An error occurred'
        }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  static async uploadFile<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Upload failed'
      }));
      throw new Error(error.message);
    }

    return await response.json();
  }
}

export const authApi = {
  signin: (email: string, password: string) =>
    ApiClient.post('/api/auth/signin', { email, password }),

  signout: () => ApiClient.post('/api/auth/signout', {}),
};
