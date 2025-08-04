export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  gender: string;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
  registerRoute: string;
  className?: string;
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  loading: boolean;
  className?: string;
}

export interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface QuickLoginButtonsProps {
  onQuickLogin: (email: string) => Promise<void>;
  loading: boolean;
  className?: string;
}

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkTo?: string;
  className?: string;
}

export interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth: boolean;
  redirectTo?: string;
}

export interface AuthPageState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  redirectPath: string | null;
} 