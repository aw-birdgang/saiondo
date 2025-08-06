import React from 'react';

interface ProgressCompletionMessageProps {
  progress: number;
}

const ProgressCompletionMessage: React.FC<ProgressCompletionMessageProps> = ({
  progress,
}) => {
  if (progress >= 100) return null;

  return (
    <div className='text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
      <p className='text-sm text-blue-700 dark:text-blue-300'>
        프로필을 완성하면 더 많은 기능을 이용할 수 있습니다! 🚀
      </p>
    </div>
  );
};

export default ProgressCompletionMessage;
