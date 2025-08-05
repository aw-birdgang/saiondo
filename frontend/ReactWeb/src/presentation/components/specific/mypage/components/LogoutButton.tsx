import React from 'react';

interface LogoutButtonProps {
  onLogout: () => void;
  isLoading: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout, isLoading }) => (
  <button
    onClick={onLogout}
    disabled={isLoading}
    className={`w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none font-medium text-sm flex items-center justify-center gap-2`}
  >
    {isLoading ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        로그아웃 중...
      </>
    ) : (
      <>
        <span>🚪</span>
        로그아웃
      </>
    )}
  </button>
);

export default LogoutButton; 