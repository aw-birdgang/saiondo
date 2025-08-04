import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useIsAuthenticated } from '../../stores/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}) => {
  const { user, loading } = useAuthStore();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // 로그인 페이지로 리다이렉트하면서 현재 위치 저장
        navigate(redirectTo, { 
          state: { from: location.pathname },
          replace: true 
        });
        return;
      }

      // 역할 기반 접근 제어 (현재는 기본 구현)
      if (requiredRole && user) {
        // TODO: 실제 역할 시스템 구현 시 수정
        // if (user.role !== requiredRole) {
        //   navigate('/unauthorized', { replace: true });
        //   return;
        // }
      }
    }
  }, [isAuthenticated, user, loading, requiredRole, navigate, location, redirectTo]);

  // 로딩 중일 때 로딩 컴포넌트 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 인증되지 않은 경우 아무것도 렌더링하지 않음
  if (!isAuthenticated) {
    return null;
  }

  // 역할이 필요한 경우 역할 체크 (현재는 기본 구현)
  if (requiredRole && user) {
    // TODO: 실제 역할 시스템 구현 시 수정
    // if (user.role !== requiredRole) {
    //   return null;
    // }
  }

  return <>{children}</>;
};

// 역할별 가드 컴포넌트들
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requiredRole="admin" redirectTo="/unauthorized">
    {children}
  </AuthGuard>
);

export const ModeratorGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requiredRole="moderator" redirectTo="/unauthorized">
    {children}
  </AuthGuard>
);

export const UserGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requiredRole="user" redirectTo="/unauthorized">
    {children}
  </AuthGuard>
);

// 게스트 전용 가드 (로그인된 사용자는 접근 불가)
export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuthStore();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // 로그인된 사용자는 홈으로 리다이렉트
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}; 