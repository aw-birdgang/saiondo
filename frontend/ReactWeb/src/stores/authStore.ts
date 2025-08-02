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
    
    // 임시 검증
    if (!email || !password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }
    
    if (password.length < 6) {
      throw new Error('비밀번호는 6자 이상이어야 합니다.');
    }
    
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
    
    // 임시 검증
    if (!email || !password || !username) {
      throw new Error('모든 필드를 입력해주세요.');
    }
    
    if (password.length < 6) {
      throw new Error('비밀번호는 6자 이상이어야 합니다.');
    }
    
    if (username.length < 2) {
      throw new Error('사용자명은 2자 이상이어야 합니다.');
    }
    
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
        set({ loading: true, error: null });
        try {
          const response = await mockApi.login(email, password);
          
          // 토큰을 로컬 스토리지에 저장
          localStorage.setItem('accessToken', response.token);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          
          toast.success('로그인에 성공했습니다!');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
          set({
            loading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          throw error;
        }
      },
      
      register: async (email: string, password: string, username: string) => {
        set({ loading: true, error: null });
        try {
          const response = await mockApi.register(email, password, username);
          
          // 토큰을 로컬 스토리지에 저장
          localStorage.setItem('accessToken', response.token);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          
          toast.success('회원가입에 성공했습니다!');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
          set({
            loading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          throw error;
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