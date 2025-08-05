import React from 'react';

interface ProfileInfoSectionProps {
  title: string;
  items: Array<{
    label: string;
    value: string;
  }>;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ title, items }) => (
  <div className="space-y-4">
    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
      {title}
    </h4>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileInfoSection; 