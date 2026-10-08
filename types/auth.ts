import { InterestCategory, User, UserRole } from "./index";

export interface RegisterPayload {
  username: string;
  displayName: string;
  email: string;
  password: string;
  role?: UserRole;
  interests: InterestCategory[];
}

export interface LoginPayload {
  loginIdentifier: string; // email or username
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface SessionData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
