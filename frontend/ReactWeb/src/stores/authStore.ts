import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// 유닛 함수들로 분리
const validateLoginInputs = (email: string, password: string): void => {
  console.log('🔍 Validating login inputs:', { email: email?.substring(0, 3) + '***', passwordLength: password?.length });
  
  if (!email || typeof email !== 'string') {
    console.error('❌ Email validation failed: invalid email type or empty');
    throw new Error('유효한 이메일을 입력해주세요.');
  }
  
  if (!password || typeof password !== 'string') {
    console.error('❌ Password validation failed: invalid password type or empty');
    throw new Error('유효한 비밀번호를 입력해주세요.');
  }
  
  if (password.length < 6) {
    console.error('❌ Password validation failed: too short (length:', password.length, ')');
    throw new Error('비밀번호는 6자 이상이어야 합니다.');
  }
  
  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Email validation failed: invalid email format');
    throw new Error('유효한 이메일 형식을 입력해주세요.');
  }
  
  console.log('✅ Login inputs validation passed');
};

const saveAuthData = (response: any): void => {
  console.log('💾 Saving auth data to localStorage');
  localStorage.setItem('accessToken', response.token);
  console.log('✅ Auth data saved successfully');
};

const handleLoginSuccess = (set: any, response: any): void => {
  console.log('🎉 Login successful, updating store state');
  set({
    user: response.user,
    token: response.token,
    isAuthenticated: true,
    loading: false,
    error: null,
  });
  console.log('✅ Store state updated, user authenticated:', { userId: response.user.id, email: response.user.email });
  toast.success('로그인에 성공했습니다!');
};

const handleLoginError = (set: any, error: any): void => {
  console.error('💥 Login error occurred:', error);
  const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
  set({
    loading: false,
    error: errorMessage,
  });
  console.log('❌ Store state updated with error:', errorMessage);
  toast.error(errorMessage);
  throw error;
};

const validateRegisterInputs = (email: string, password: string, username: string): void => {
  console.log('🔍 Validating register inputs:', { 
    email: email?.substring(0, 3) + '***', 
    passwordLength: password?.length,
    username: username?.substring(0, 2) + '***'
  });
  
  if (!email?.trim() || typeof email !== 'string') {
    console.error('❌ Email validation failed: invalid email type or empty');
    throw new Error('유효한 이메일을 입력해주세요.');
  }
  
  if (!password?.trim() || typeof password !== 'string') {
    console.error('❌ Password validation failed: invalid password type or empty');
    throw new Error('유효한 비밀번호를 입력해주세요.');
  }
  
  if (!username?.trim() || typeof username !== 'string') {
    console.error('❌ Username validation failed: invalid username type or empty');
    throw new Error('유효한 사용자명을 입력해주세요.');
  }
  
  if (password.length < 6) {
    console.error('❌ Password validation failed: too short (length:', password.length, ')');
    throw new Error('비밀번호는 6자 이상이어야 합니다.');
  }
  
  if (username.length < 2) {
    console.error('❌ Username validation failed: too short (length:', username.length, ')');
    throw new Error('사용자명은 2자 이상이어야 합니다.');
  }
  
  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Email validation failed: invalid email format');
    throw new Error('유효한 이메일 형식을 입력해주세요.');
  }
  
  console.log('✅ Register inputs validation passed');
};

// 임시 API 함수들 (실제 구현 시 교체)
const mockApi = {
  login: async (email: string, password: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 입력값 검증
    validateLoginInputs(email, password);
    
    return {
      user: {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  },
  
  register: async (email: string, password: string, username: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, username })
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 입력값 검증
    validateRegisterInputs(email, password, username);
    
    return {
      user: {
        id: crypto.randomUUID(),
        email,
        name: username,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      login: async (email: string, password: string) => {
        console.log('🚀 AuthStore login called with email:', email, 'type:', typeof email);
        console.log('📊 Current store state before login:', {
          isAuthenticated: get().isAuthenticated,
          loading: get().loading,
          hasUser: !!get().user
        });
        
        set({ loading: true, error: null });
        
        try {
          console.log('📡 Making API call to login...');
          const response = await mockApi.login(email, password);
          console.log('📥 API response received:', { userId: response.user.id, hasToken: !!response.token });
          
          saveAuthData(response);
          handleLoginSuccess(set, response);
        } catch (error) {
          handleLoginError(set, error);
        }
      },
      
      register: async (email: string, password: string, username: string) => {
        console.log('�� AuthStore register called with:', { 
          email: email?.substring(0, 3) + '***', 
          username: username?.substring(0, 2) + '***',
          passwordLength: password?.length 
        });
        
        set({ loading: true, error: null });
        try {
          console.log('📡 Making API call to register...');
          const response = await mockApi.register(email, password, username);
          console.log('📥 API response received:', { userId: response.user?.id, hasToken: !!response.token });
          
          saveAuthData(response);
          handleLoginSuccess(set, response);
        } catch (error) {
          handleLoginError(set, error);
        }
      },
      
      logout: () => {
        // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem('accessToken');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        
        toast.success('로그아웃되었습니다.');
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 