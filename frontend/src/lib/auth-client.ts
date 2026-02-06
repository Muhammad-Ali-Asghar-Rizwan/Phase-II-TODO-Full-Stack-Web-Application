// Custom authentication client for the existing Python JWT backend
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

interface TokenResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData extends LoginCredentials {
  name?: string;
}

class AuthClient {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  async signup(data: SignupData): Promise<TokenResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    return response.json();
  }

  async signIn(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  async signOut(): Promise<void> {
    // Clear local storage tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    // In the existing system, we don't have a direct endpoint to get user by token
    // So we'll retrieve from localStorage where it was stored during login
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('auth_user');
      return userStr ? JSON.parse(userStr) : null;
    }
    
    return null;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  storeToken(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  }
}

export const authClient = new AuthClient();

// Export the methods to match the expected interface
export const { signIn, signUp, signOut } = authClient;

// Custom hook for session management
export function useSession() {
  const [session, setSession] = useState<{ user: any; isLoading: boolean }>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await authClient.getCurrentUser();
        setSession({ user, isLoading: false });
      } catch (error) {
        setSession({ user: null, isLoading: false });
      }
    };

    checkSession();
  }, []);

  return session;
}
