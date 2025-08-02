import React, { useState } from 'react';
import { useAsyncState } from '../../hooks/useAsyncState';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

const AsyncStateExample: React.FC = () => {
  const [userId, setUserId] = useState<number>(1);

  // Mock API function
  const fetchUser = async (id: number): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate random error
    if (Math.random() < 0.3) {
      throw new Error(`사용자 ${id}를 찾을 수 없습니다.`);
    }

    return {
      id,
      name: `사용자 ${id}`,
      email: `user${id}@example.com`,
      avatar: `https://i.pravatar.cc/150?u=${id}`
    };
  };

  const { 
    data: user, 
    loading, 
    error, 
    execute, 
    reset 
  } = useAsyncState(fetchUser, {
    onSuccess: (data) => {
      console.log('사용자 로드 성공:', data);
    },
    onError: (error) => {
      console.error('사용자 로드 실패:', error);
    },
    onSettled: () => {
      console.log('사용자 로드 완료');
    }
  });

  const handleLoadUser = () => {
    execute(userId);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">비동기 상태 관리 예시</h2>
      
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex gap-2">
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            className="flex-1 px-3 py-2 border rounded-lg"
            min="1"
            max="100"
          />
          <button
            onClick={handleLoadUser}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? '로딩 중...' : '사용자 로드'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            초기화
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">사용자 정보를 불러오는 중...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
            <h3 className="font-semibold text-red-800">오류 발생</h3>
            <p className="text-red-700">{error.message}</p>
          </div>
        )}

        {/* Success State */}
        {user && !loading && !error && (
          <div className="p-4 bg-green-100 border border-green-400 rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-green-800">{user.name}</h3>
                <p className="text-green-700">{user.email}</p>
                <p className="text-sm text-green-600">ID: {user.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">사용 방법:</h3>
          <ul className="text-sm space-y-1">
            <li>• 사용자 ID를 입력하고 "사용자 로드" 버튼을 클릭하세요</li>
            <li>• 30% 확률로 오류가 발생하여 에러 처리를 확인할 수 있습니다</li>
            <li>• "초기화" 버튼으로 상태를 리셋할 수 있습니다</li>
            <li>• 콘솔에서 성공/실패/완료 콜백을 확인할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AsyncStateExample; 