import React from 'react';
import { useFirebase } from '../../core/hooks/useFirebase';
import { useFCMToken } from '../../core/hooks/useFirebase';
import { useFCMTokenStatus } from '../../core/hooks/useFirebaseApi';
import { useAuthStore } from '../../core/stores/authStore';

const FirebaseTest: React.FC = () => {
  const { 
    isInitialized, 
    isSupported, 
    fcmToken, 
    hasPermission, 
    requestPermission 
  } = useFirebase();
  
  const { fcmToken: tokenFromHook, isTokenRegistered } = useFCMToken();
  const { userId } = useAuthStore();
  const { data: tokenStatus } = useFCMTokenStatus(userId || '');

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  const handleTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('테스트 알림', {
        body: '이것은 테스트 알림입니다.',
        icon: '/favicon.ico',
      });
    } else {
      alert('알림 권한이 필요합니다.');
    }
  };

  const copyTokenToClipboard = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      alert('FCM 토큰이 클립보드에 복사되었습니다.');
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-secondary-container rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Firebase 테스트
      </h2>
      
      <div className="space-y-4">
        {/* Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">초기화 상태</p>
            <p className={`font-medium ${isInitialized ? 'text-green-600' : 'text-red-600'}`}>
              {isInitialized ? '초기화됨' : '초기화 안됨'}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">지원 여부</p>
            <p className={`font-medium ${isSupported ? 'text-green-600' : 'text-red-600'}`}>
              {isSupported ? '지원됨' : '지원 안됨'}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">알림 권한</p>
            <p className={`font-medium ${hasPermission ? 'text-green-600' : 'text-red-600'}`}>
              {hasPermission ? '허용됨' : '거부됨'}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">토큰 등록</p>
            <p className={`font-medium ${isTokenRegistered ? 'text-green-600' : 'text-red-600'}`}>
              {isTokenRegistered ? '등록됨' : '등록 안됨'}
            </p>
          </div>
        </div>

        {/* FCM Token */}
        {fcmToken && (
          <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">FCM 토큰</p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-gray-100 dark:bg-dark-background p-2 rounded flex-1 break-all">
                {fcmToken}
              </code>
              <button
                onClick={copyTokenToClipboard}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                복사
              </button>
            </div>
          </div>
        )}

        {/* Token Status */}
        {tokenStatus && (
          <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">토큰 상태</p>
            <div className="space-y-1">
              <p className="text-sm">
                등록됨: {tokenStatus.registered ? '예' : '아니오'}
              </p>
              {tokenStatus.lastUpdated && (
                <p className="text-sm">
                  마지막 업데이트: {new Date(tokenStatus.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {!hasPermission && (
            <button
              onClick={handleRequestPermission}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              알림 권한 요청
            </button>
          )}
          
          <button
            onClick={handleTestNotification}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            테스트 알림
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            새로고침
          </button>
        </div>

        {/* Debug Info */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">
            디버그 정보
          </summary>
          <div className="mt-2 p-3 bg-gray-50 dark:bg-dark-surface rounded text-xs">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({
                isInitialized,
                isSupported,
                hasPermission,
                fcmToken: fcmToken ? `${fcmToken.substring(0, 20)}...` : null,
                tokenFromHook: tokenFromHook ? `${tokenFromHook.substring(0, 20)}...` : null,
                isTokenRegistered,
                tokenStatus,
                userId,
                notificationSupport: 'Notification' in window,
                serviceWorkerSupport: 'serviceWorker' in navigator,
              }, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
};

export default FirebaseTest; 