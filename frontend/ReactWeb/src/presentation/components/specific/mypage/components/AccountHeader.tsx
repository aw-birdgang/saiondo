import React from 'react';

const AccountHeader: React.FC = () => (
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        계정 관리
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        계정 관련 설정을 관리하세요
      </p>
    </div>
  </div>
);

export default AccountHeader; 