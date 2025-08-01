import React from "react";
import { useTranslation } from "react-i18next";

interface User {
  name: string;
  profileUrl?: string;
  mbti?: string;
}

interface MbtiMatchProps {
  user1: User;
  user2: User;
  matchPercent?: string;
  className?: string;
}

const MbtiMatch: React.FC<MbtiMatchProps> = ({ 
  user1, 
  user2, 
  matchPercent, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t("couple_mbti_match")}
      </h3>
      <div className="flex items-center space-x-4">
        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full font-medium">
          {user1.mbti}
        </span>
        <span className="text-pink-500">↔️</span>
        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full font-medium">
          {user2.mbti}
        </span>
        {matchPercent && (
          <span className="text-pink-600 font-bold">
            {matchPercent}% {t("good_match")}
          </span>
        )}
      </div>
    </div>
  );
};

export default MbtiMatch; 