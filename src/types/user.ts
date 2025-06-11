export interface User {
  id: string; // ULID
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at?: string;
  avatar?: string;
  phone?: string;
  birthday?: string;
  favorite_count?: number;
  review_count?: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token?: string;
  };
}

export interface ErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
} 