import React from 'react';

const MyPageError: React.FC<{ error?: Error; retry?: () => void }> = ({
  error,
  retry,
}) => (
  <div
    className='flex flex-col items-center justify-center min-h-[400px] space-y-4'
    role='alert'
    aria-live='assertive'
  >
    <span className='text-6xl text-red-500' aria-hidden>
      ⚠️
    </span>
    <div className='text-center'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
        페이지를 불러오는 중 오류가 발생했습니다
      </h3>
      <p className='text-gray-600 dark:text-gray-300 mb-4'>
        {error?.message || '일시적인 오류입니다. 잠시 후 다시 시도해주세요.'}
      </p>
      {retry && (
        <button
          onClick={retry}
          className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors'
        >
          <span className='mr-2' aria-hidden>
            🔄
          </span>
          다시 시도
        </button>
      )}
    </div>
  </div>
);

export default MyPageError;
