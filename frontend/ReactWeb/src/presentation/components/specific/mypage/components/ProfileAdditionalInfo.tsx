import React from 'react';

interface AdditionalInfoItem {
  icon: string;
  title: string;
  value: string;
}

interface ProfileAdditionalInfoProps {
  items: AdditionalInfoItem[];
}

const ProfileAdditionalInfo: React.FC<ProfileAdditionalInfoProps> = ({ items }) => (
  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
      추가 정보
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">{item.icon}</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{item.value}</div>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileAdditionalInfo; 