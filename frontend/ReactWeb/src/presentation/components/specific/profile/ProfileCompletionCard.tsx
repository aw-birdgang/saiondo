import React from 'react';

interface ProfileCompletionCardProps {
  completionPercentage: number;
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  completionPercentage,
}) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="font-medium text-txt mb-2">프로필 완성도</h3>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-txt-secondary">{completionPercentage}% 완성</p>
    </div>
  );
};

export default ProfileCompletionCard; 