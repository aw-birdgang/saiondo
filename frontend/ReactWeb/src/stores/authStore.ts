import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { apiClient } from '../infrastructure/api/ApiClient';

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
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Selector for computed isAuthenticated
export const useIsAuthenticated = () => {
  const token = useAuthStore(state => state.token);
  return !!token;
};

// 유닛 함수들로 분리
// const validateLoginInputs = (email: string, password: string): void => {
//   if (!email || typeof email !== 'string') {
//     throw new Error('유효한 이메일을 입력해주세요.');
//   }

//   if (!password || typeof password !== 'string') {
//     throw new Error('유효한 비밀번호를 입력해주세요.');
//   }

//   if (password.length < 6) {
//     throw new Error('비밀번호는 6자 이상이어야 합니다.');
//   }

//   // 이메일 형식 검증
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     throw new Error('유효한 이메일 형식을 입력해주세요.');
//   }
// };

const saveAuthData = (response: { user: User; token: string }): void => {
  localStorage.setItem('accessToken', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
  // ApiClient와 동기화를 위해 localStorage에도 저장
};

const handleLoginSuccess = (
  set: any,
  response: { user: User; token: string }
): void => {
  set({
    user: response.user,
    token: response.token,
    loading: false,
    error: null,
  });
  toast.success('로그인에 성공했습니다!');
};

const handleLoginError = (set: any, error: unknown): void => {
  const errorMessage =
    error instanceof Error ? error.message : '로그인에 실패했습니다.';
  set({
    loading: false,
    error: errorMessage,
  });
  toast.error(errorMessage);
  throw error;
};

// const validateRegisterInputs = (
//   email: string,
//   password: string,
//   username: string
// ): void => {
//   if (!email?.trim() || typeof email !== 'string') {
//     throw new Error('유효한 이메일을 입력해주세요.');
//   }

//   if (!password?.trim() || typeof password !== 'string') {
//     throw new Error('유효한 비밀번호를 입력해주세요.');
//   }

//   if (!username?.trim() || typeof username !== 'string') {
//     throw new Error('유효한 사용자명을 입력해주세요.');
//   }

//   if (password.length < 6) {
//     throw new Error('비밀번호는 6자 이상이어야 합니다.');
//   }

//   if (username.length < 2) {
//     throw new Error('사용자명은 2자 이상이어야 합니다.');
//   }

//   // 이메일 형식 검증
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     throw new Error('유효한 이메일 형식을 입력해주세요.');
//   }
// };

// 실제 API 함수들로 변경
const api = {
  login: async (email: string, password: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }

    return response.json();
  },

  register: async (email: string, password: string, username: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: username,
          gender: 'UNKNOWN',
          birthDate: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Registration failed: ${response.status}`
      );
    }

    return response.json();
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      loading: true, // 초기 로딩 상태를 true로 설정하여 초기화 완료까지 대기
      error: null,

      // Actions
      setUser: user => set({ user }),
      setToken: token => set({ token }),
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });

        try {
          const response = await api.login(email, password);

          // 백엔드 응답 구조에 맞게 수정
          const authData = {
            user: response.user,
            token: response.accessToken,
          };

          saveAuthData(authData);
          handleLoginSuccess(set, authData);
          
          // 디버깅용 로그
          console.log('✅ Login successful:', {
            user: authData.user,
            tokenExists: !!authData.token,
            tokenLength: authData.token?.length
          });
        } catch (error) {
          handleLoginError(set, error);
        }
      },

      register: async (email: string, password: string, username: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.register(email, password, username);

          // 백엔드 응답 구조에 맞게 수정
          const authData = {
            user: response.user,
            token: response.accessToken,
          };

          saveAuthData(authData);
          handleLoginSuccess(set, authData);
        } catch (error) {
          handleLoginError(set, error);
        }
      },

      logout: () => {
        console.log('🔄 Logging out...');
        
        // 로컬 스토리지에서 토큰과 사용자 정보 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Zustand persist 데이터도 제거
        localStorage.removeItem('auth-storage');
        
        // API 클라이언트에서도 토큰 제거
        apiClient.removeAuthToken();

        set({
          user: null,
          token: null,
          loading: false,
          error: null,
        });

        toast.success('로그아웃되었습니다.');
        
        // 로그인 페이지로 리다이렉트 (React Router 사용)
        setTimeout(() => {
          // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 100);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        token: state.token,
      }),
      // 초기화 시 로딩 상태를 false로 설정하고, 토큰이 없으면 user도 null로 설정
      onRehydrateStorage: () => state => {
        if (state) {
          state.loading = false;
          // 토큰이 없거나 빈 문자열이면 user도 null로 설정
          if (!state.token || state.token.trim() === '') {
            state.token = null;
            state.user = null;
          }
        }
      },
    }
  )
);
