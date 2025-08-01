import React from "react";
import { UserAvatar, HeartIcon } from "../common";

interface User {
  name: string;
  profileUrl?: string;
  mbti?: string;
}

interface CoupleProfileProps {
  user1: User;
  user2: User;
  className?: string;
}

const CoupleProfile: React.FC<CoupleProfileProps> = ({ 
  user1, 
  user2, 
  className = "" 
}) => {
  return (
    <div className={`bg-gradient-to-r from-pink-100 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-center space-x-4 mb-4">
        <UserAvatar 
          name={user1.name}
          profileUrl={user1.profileUrl}
          size="lg"
        />
        <HeartIcon 
          size="lg"
          animated={true}
        />
        <UserAvatar 
          name={user2.name}
          profileUrl={user2.profileUrl}
          size="lg"
        />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
          {user1.name} <HeartIcon size="sm" /> {user2.name}
        </h2>
        {user1.mbti && user2.mbti && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {user1.mbti} × {user2.mbti}
          </p>
        )}
      </div>
    </div>
  );
};

export default CoupleProfile; 