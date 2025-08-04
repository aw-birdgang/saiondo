import React from 'react';

interface ErrorFallbackProps {
  error?: Error;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error,
  title = "페이지 로딩에 실패했습니다",
  message = "잠시 후 다시 시도해주세요.",
  onRetry
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 mb-4">
          {message}
        </p>
        {error && (
          <details className="text-sm text-gray-500">
            <summary>오류 상세정보</summary>
            <pre className="mt-2 text-left bg-gray-100 p-2 rounded">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={handleRetry}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          새로고침
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback; 