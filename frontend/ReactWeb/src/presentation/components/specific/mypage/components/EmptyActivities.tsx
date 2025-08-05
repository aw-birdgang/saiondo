import React from 'react';

interface EmptyActivitiesProps {
  onStartActivity?: () => void;
}

const EmptyActivities: React.FC<EmptyActivitiesProps> = ({ onStartActivity }) => (
  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
    <div className="text-4xl mb-4">📝</div>
    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      아직 활동 내역이 없습니다
    </h4>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      새로운 활동을 시작해보세요!
    </p>
    <button 
      onClick={onStartActivity}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
    >
      활동 시작하기
    </button>
  </div>
);

export default EmptyActivities; 