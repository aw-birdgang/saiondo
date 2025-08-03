import React, { useState, useEffect } from 'react';
import { usePushNotification } from '../../../infrastructure/notification/PushNotificationService';
import { toast } from 'react-hot-toast';

export const NotificationSettings: React.FC = () => {
  const {
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification,
    getSettings
  } = usePushNotification();

  const [settings, setSettings] = useState({
    permission: 'default' as NotificationPermission,
    subscribed: false,
    supported: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // 설정 로드
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const currentSettings = await getSettings();
    setSettings(currentSettings);
  };

  // 권한 요청
  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const permission = await requestPermission();
      if (permission === 'granted') {
        toast.success('알림 권한이 허용되었습니다.');
        await loadSettings();
      } else {
        toast.error('알림 권한이 거부되었습니다.');
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      toast.error('권한 요청에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 푸시 알림 구독
  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const subscription = await subscribeToPush();
      if (subscription) {
        toast.success('푸시 알림 구독이 완료되었습니다.');
        await loadSettings();
      } else {
        toast.error('푸시 알림 구독에 실패했습니다.');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      toast.error('구독 처리에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 푸시 알림 구독 해제
  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const success = await unsubscribeFromPush();
      if (success) {
        toast.success('푸시 알림 구독이 해제되었습니다.');
        await loadSettings();
      } else {
        toast.error('푸시 알림 구독 해제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Unsubscription failed:', error);
      toast.error('구독 해제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 테스트 알림 전송
  const handleTestNotification = async () => {
    try {
      const success = await sendTestNotification();
      if (success) {
        toast.success('테스트 알림을 전송했습니다.');
      } else {
        toast.error('테스트 알림 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Test notification failed:', error);
      toast.error('테스트 알림 전송에 실패했습니다.');
    }
  };

  // 권한 상태에 따른 메시지
  const getPermissionMessage = () => {
    switch (settings.permission) {
      case 'granted':
        return '알림 권한이 허용되었습니다.';
      case 'denied':
        return '알림 권한이 거부되었습니다. 브라우저 설정에서 변경해주세요.';
      case 'default':
        return '알림 권한을 요청해주세요.';
      default:
        return '알 수 없는 권한 상태입니다.';
    }
  };

  // 권한 상태에 따른 색상
  const getPermissionColor = () => {
    switch (settings.permission) {
      case 'granted':
        return 'text-green-600';
      case 'denied':
        return 'text-red-600';
      case 'default':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!settings.supported) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">알림 설정</h3>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">이 브라우저는 푸시 알림을 지원하지 않습니다.</p>
          <p className="text-sm text-gray-500">
            Chrome, Firefox, Safari, Edge 등의 최신 브라우저를 사용해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-6">알림 설정</h3>

      {/* 권한 상태 */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">알림 권한</h4>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className={`font-medium ${getPermissionColor()}`}>
              {getPermissionMessage()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              새로운 메시지나 중요한 알림을 받을 수 있습니다.
            </p>
          </div>
          {settings.permission !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : '권한 요청'}
            </button>
          )}
        </div>
      </div>

      {/* 푸시 알림 구독 */}
      {settings.permission === 'granted' && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">푸시 알림</h4>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">
                {settings.subscribed ? '푸시 알림이 활성화되어 있습니다.' : '푸시 알림을 구독해주세요.'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {settings.subscribed 
                  ? '새로운 메시지나 알림을 실시간으로 받을 수 있습니다.'
                  : '브라우저를 닫아도 알림을 받을 수 있습니다.'
                }
              </p>
            </div>
            <button
              onClick={settings.subscribed ? handleUnsubscribe : handleSubscribe}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed ${
                settings.subscribed
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isLoading ? '처리 중...' : (settings.subscribed ? '구독 해제' : '구독하기')}
            </button>
          </div>
        </div>
      )}

      {/* 테스트 알림 */}
      {settings.permission === 'granted' && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">테스트 알림</h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              알림이 제대로 작동하는지 테스트해보세요.
            </p>
            <button
              onClick={handleTestNotification}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? '전송 중...' : '테스트 알림 보내기'}
            </button>
          </div>
        </div>
      )}

      {/* 알림 유형 설정 */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">알림 유형</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="mr-3 rounded"
            />
            <div>
              <p className="font-medium">새 메시지 알림</p>
              <p className="text-sm text-gray-600">채팅방에 새 메시지가 올 때 알림</p>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="mr-3 rounded"
            />
            <div>
              <p className="font-medium">시스템 알림</p>
              <p className="text-sm text-gray-600">중요한 시스템 업데이트나 공지사항</p>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="mr-3 rounded"
            />
            <div>
              <p className="font-medium">AI 상담사 응답</p>
              <p className="text-sm text-gray-600">AI 상담사의 응답이 준비되었을 때</p>
            </div>
          </label>
        </div>
      </div>

      {/* 알림 시간 설정 */}
      <div>
        <h4 className="font-medium mb-3">알림 시간</h4>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-3">
            알림을 받을 시간을 설정할 수 있습니다.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작 시간
              </label>
              <input
                type="time"
                defaultValue="09:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료 시간
              </label>
              <input
                type="time"
                defaultValue="22:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 