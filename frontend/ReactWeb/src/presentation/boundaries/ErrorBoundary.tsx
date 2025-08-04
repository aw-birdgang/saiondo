import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { DomainError } from '../../domain/errors/DomainError';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // 에러 로깅
    this.logError(error, errorInfo);
    
    // 콜백 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private logError(error: Error, errorInfo: ErrorInfo) {
    // 에러 정보를 서버로 전송하거나 로깅 서비스에 전송
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Boundary Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error Data:', errorData);
      console.groupEnd();
    }

    // 프로덕션에서는 에러 로깅 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      // TODO: 실제 에러 로깅 서비스 연동
      // sendErrorToLoggingService(errorData);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return <ErrorFallback 
        error={this.state.error} 
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
  onGoHome: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onRetry, onGoHome }) => {
  const isDomainError = error instanceof DomainError;
  const errorMessage = error?.message || '알 수 없는 오류가 발생했습니다.';
  const errorCode = isDomainError ? (error as DomainError).code : 'UNKNOWN_ERROR';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isDomainError ? '도메인 오류' : '시스템 오류'}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {errorMessage}
          </p>
          
          {isDomainError && (
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">오류 코드:</span> {errorCode}
              </p>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={onRetry}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
            
            <button
              onClick={onGoHome}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              홈으로
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                개발자 정보 (클릭하여 확장)
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto">
                <pre>{error.stack}</pre>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

// 특화된 Error Boundary들
export class DomainErrorBoundary extends ErrorBoundary {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error instanceof DomainError) {
      super.componentDidCatch(error, errorInfo);
    } else {
      // 도메인 에러가 아닌 경우 상위로 전파
      throw error;
    }
  }
}

export class NetworkErrorBoundary extends ErrorBoundary {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      super.componentDidCatch(error, errorInfo);
    } else {
      // 네트워크 에러가 아닌 경우 상위로 전파
      throw error;
    }
  }
}

// HOC로 Error Boundary 래핑
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
}; 