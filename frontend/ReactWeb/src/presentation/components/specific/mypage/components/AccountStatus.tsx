import React from 'react';

const AccountStatus: React.FC = () => (
  <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            계정 상태
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            정상적으로 작동 중
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-green-600 dark:text-green-400">
          활성
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          상태
        </p>
      </div>
    </div>
  </div>
);

export default AccountStatus; 