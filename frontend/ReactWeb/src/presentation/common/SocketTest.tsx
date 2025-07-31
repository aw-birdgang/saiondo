import React, { useState } from 'react';
import { useSocket } from '../../core/hooks/useSocket';
import { useAuthStore } from '../../core/stores/authStore';

const SocketTest: React.FC = () => {
  const { userId } = useAuthStore();
  const [testUserId, setTestUserId] = useState(userId || 'test-user');
  const [testAssistantId, setTestAssistantId] = useState('test-assistant');
  const [testChannelId, setTestChannelId] = useState('test-channel');
  const [testMessage, setTestMessage] = useState('안녕하세요!');
  const [autoConnect, setAutoConnect] = useState(false);

  const {
    isConnected,
    isConnecting,
    error: socketError,
    messages: socketMessages,
    isAwaitingLLM,
    connect: connectSocket,
    disconnect: disconnectSocket,
    sendMessage: sendSocketMessage,
    reconnect: reconnectSocket,
    clearMessages,
  } = useSocket({
    userId: autoConnect ? testUserId : undefined,
    assistantId: autoConnect ? testAssistantId : undefined,
    channelId: autoConnect ? testChannelId : undefined,
    autoConnect,
  });

  const handleConnect = () => {
    connectSocket(testUserId, testAssistantId, testChannelId);
  };

  const handleSendTestMessage = () => {
    if (testMessage.trim()) {
      sendSocketMessage(testMessage);
      setTestMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendTestMessage();
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-secondary-container rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Socket.IO 테스트
      </h2>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">연결 상태</p>
            <p className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? '연결됨' : '연결 안됨'}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">연결 중</p>
            <p className={`font-medium ${isConnecting ? 'text-blue-600' : 'text-gray-600'}`}>
              {isConnecting ? '연결 중...' : '대기 중'}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">AI 응답 대기</p>
            <p className={`font-medium ${isAwaitingLLM ? 'text-yellow-600' : 'text-gray-600'}`}>
              {isAwaitingLLM ? '응답 대기 중...' : '대기 중'}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">메시지 수</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {socketMessages.length}개
            </p>
          </div>
        </div>

        {/* Error Display */}
        {socketError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>에러:</strong> {socketError}
            </p>
          </div>
        )}

        {/* Connection Settings */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">연결 설정</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-secondary-container dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assistant ID
              </label>
              <input
                type="text"
                value={testAssistantId}
                onChange={(e) => setTestAssistantId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-secondary-container dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Channel ID
              </label>
              <input
                type="text"
                value={testChannelId}
                onChange={(e) => setTestChannelId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-secondary-container dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoConnect"
              checked={autoConnect}
              onChange={(e) => setAutoConnect(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="autoConnect" className="text-sm text-gray-700 dark:text-gray-300">
              자동 연결 (페이지 로드 시)
            </label>
          </div>
        </div>

        {/* Connection Actions */}
        <div className="flex flex-wrap gap-2">
          {!isConnected && !isConnecting && (
            <button
              onClick={handleConnect}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              연결
            </button>
          )}
          
          {isConnected && (
            <button
              onClick={disconnectSocket}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              연결 해제
            </button>
          )}
          
          {!isConnected && !isConnecting && (
            <button
              onClick={reconnectSocket}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              재연결
            </button>
          )}
          
          <button
            onClick={clearMessages}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            메시지 지우기
          </button>
        </div>

        {/* Message Input */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">메시지 전송</h3>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="테스트 메시지를 입력하세요..."
              disabled={!isConnected || isAwaitingLLM}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-secondary-container dark:text-white disabled:opacity-50"
            />
            <button
              onClick={handleSendTestMessage}
              disabled={!testMessage.trim() || !isConnected || isAwaitingLLM}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>

        {/* Messages Display */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">메시지 내역</h3>
          
          <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4 h-64 overflow-y-auto">
            {socketMessages.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                메시지가 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {socketMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-2 rounded ${
                      message.sender === 'USER'
                        ? 'bg-blue-100 dark:bg-blue-900/20 ml-8'
                        : 'bg-gray-100 dark:bg-gray-800 mr-8'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {message.message}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {message.sender}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Debug Info */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">
            디버그 정보
          </summary>
          <div className="mt-2 p-3 bg-gray-50 dark:bg-dark-surface rounded text-xs">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({
                isConnected,
                isConnecting,
                isAwaitingLLM,
                socketError,
                messageCount: socketMessages.length,
                testUserId,
                testAssistantId,
                testChannelId,
                autoConnect,
              }, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
};

export default SocketTest; 