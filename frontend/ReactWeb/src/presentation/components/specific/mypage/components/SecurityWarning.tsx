import React from 'react';

const SecurityWarning: React.FC = () => (
  <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
    <span className="text-yellow-600 dark:text-yellow-400 text-sm">⚠️</span>
    <div>
      <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
        보안 알림
      </p>
      <p className="text-xs text-yellow-700 dark:text-yellow-300">
        로그아웃 시 모든 세션이 종료되며, 다시 로그인해야 합니다.
      </p>
    </div>
  </div>
);

export default SecurityWarning; 