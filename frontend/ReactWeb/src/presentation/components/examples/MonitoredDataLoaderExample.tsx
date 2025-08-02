import React, { useState } from 'react';
import { useDataLoader } from '../../hooks/useDataLoader';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const MonitoredDataLoaderExample: React.FC = () => {
  const [userId, setUserId] = useState(1);
  const [enableMonitoring, setEnableMonitoring] = useState(true);

  // Mock API function with variable delay
  const fetchPosts = async (): Promise<Post[]> => {
    // Simulate variable API delay (100ms to 2000ms)
    const delay = 100 + Math.random() * 1900;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate random error (10% chance)
    if (Math.random() < 0.1) {
      throw new Error(`사용자 ${userId}의 게시물을 불러올 수 없습니다.`);
    }

    return Array.from({ length: 5 }, (_, index) => ({
      id: userId * 100 + index + 1,
      title: `사용자 ${userId}의 게시물 ${index + 1}`,
      body: `이것은 사용자 ${userId}의 ${index + 1}번째 게시물입니다. 성능 모니터링을 통해 로딩 시간을 확인할 수 있습니다.`,
      userId
    }));
  };

  const { 
    data: posts, 
    loading, 
    error, 
    loadData, 
    refresh, 
    clearError, 
    clearCache 
  } = useDataLoader(
    fetchPosts,
    [userId], // dependencies
    {
      autoLoad: true,
      showErrorToast: true,
      errorMessage: '게시물을 불러오는데 실패했습니다.',
      cacheTime: 30000, // 30초 캐시
      retryCount: 2,
      retryDelay: 1000,
      enablePerformanceMonitoring: enableMonitoring // 성능 모니터링 활성화
    }
  );

  const handleUserIdChange = (newUserId: number) => {
    setUserId(newUserId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">성능 모니터링이 활성화된 데이터 로더</h2>
      
      <div className="space-y-6">
        {/* Controls */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">컨트롤</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">사용자 ID</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(id => (
                  <button
                    key={id}
                    onClick={() => handleUserIdChange(id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      userId === id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">성능 모니터링</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enableMonitoring}
                  onChange={(e) => setEnableMonitoring(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">활성화</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={refresh}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 hover:bg-green-600"
            >
              {loading ? '로딩 중...' : '새로고침'}
            </button>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              에러 초기화
            </button>
            <button
              onClick={clearCache}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              캐시 초기화
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">상태 정보</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">로딩 상태:</span>
              <span className={`ml-2 ${loading ? 'text-orange-600' : 'text-green-600'}`}>
                {loading ? '로딩 중' : '완료'}
              </span>
            </div>
            <div>
              <span className="font-medium">게시물 수:</span>
              <span className="ml-2 text-blue-600">{posts?.length || 0}개</span>
            </div>
            <div>
              <span className="font-medium">에러 상태:</span>
              <span className={`ml-2 ${error ? 'text-red-600' : 'text-green-600'}`}>
                {error ? '에러 발생' : '정상'}
              </span>
            </div>
            <div>
              <span className="font-medium">모니터링:</span>
              <span className={`ml-2 ${enableMonitoring ? 'text-green-600' : 'text-gray-600'}`}>
                {enableMonitoring ? '활성화' : '비활성화'}
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">게시물을 불러오는 중...</p>
            <p className="text-sm text-gray-500">
              성능 모니터링이 활성화되어 있어 실행 시간이 측정됩니다
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
            <h3 className="font-semibold text-red-800">오류 발생</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Success State */}
        {posts && !loading && !error && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">사용자 {userId}의 게시물</h3>
            <div className="grid gap-4">
              {posts.map((post) => (
                <div key={post.id} className="p-4 bg-white border rounded-lg shadow-sm">
                  <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                  <p className="text-gray-600">{post.body}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    게시물 ID: {post.id} | 사용자 ID: {post.userId}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">사용 방법</h3>
          <ul className="text-sm space-y-1">
            <li>• 사용자 ID를 변경하여 다른 사용자의 게시물을 로드하세요</li>
            <li>• 성능 모니터링을 활성화하면 실행 시간이 측정됩니다</li>
            <li>• "새로고침" 버튼으로 캐시를 무시하고 새로 로드할 수 있습니다</li>
            <li>• "캐시 초기화" 버튼으로 저장된 캐시를 삭제할 수 있습니다</li>
            <li>• 성능 대시보드에서 실행 시간 통계를 확인할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MonitoredDataLoaderExample; 