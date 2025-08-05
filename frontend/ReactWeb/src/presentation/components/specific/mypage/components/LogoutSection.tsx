import React from 'react';
import SecurityWarning from './SecurityWarning';
import LogoutButton from './LogoutButton';

interface LogoutSectionProps {
  onLogout: () => void;
  isLoading: boolean;
}

const LogoutSection: React.FC<LogoutSectionProps> = ({ onLogout, isLoading }) => (
  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-lg p-6 border border-red-200 dark:border-red-800">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">🚪</span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            로그아웃
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            현재 계정에서 로그아웃합니다
          </p>
        </div>
      </div>
    </div>
    
    <div className="space-y-3">
      <SecurityWarning />
      <LogoutButton onLogout={onLogout} isLoading={isLoading} />
    </div>
  </div>
);

export default LogoutSection; 