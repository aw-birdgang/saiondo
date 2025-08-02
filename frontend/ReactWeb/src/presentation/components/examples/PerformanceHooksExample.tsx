import React, { useState, useCallback } from 'react';
import { 
  useMemoizedCallback, 
  useThrottle, 
  useIntersectionObserver,
  useDebounce 
} from '../../hooks';

const PerformanceHooksExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [expensiveResult, setExpensiveResult] = useState(0);
  const [scrollCount, setScrollCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Expensive calculation function
  const expensiveCalculation = useCallback((a: number, b: number) => {
    console.log('Expensive calculation executed!');
    // Simulate expensive operation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i) * Math.sin(i);
    }
    return result + a + b;
  }, []);

  // Memoized callback with caching
  const memoizedCalculation = useMemoizedCallback(
    expensiveCalculation,
    [count], // Only recalculate when count changes
    {
      maxAge: 5000, // Cache for 5 seconds
      equalityFn: (prev, next) => prev[0] === next[0] && prev[1] === next[1]
    }
  );

  // Throttled scroll handler
  const throttledScrollHandler = useThrottle(
    useCallback(() => {
      setScrollCount(prev => prev + 1);
    }, []),
    100 // Throttle to 100ms
  );

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Intersection observer
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '50px',
    freezeOnceVisible: false
  });

  // Update visibility when intersection changes
  React.useEffect(() => {
    setIsVisible(isIntersecting);
  }, [isIntersecting]);

  // Handle expensive calculation
  const handleCalculate = () => {
    const result = memoizedCalculation(count, count * 2);
    setExpensiveResult(result);
  };

  // Handle scroll
  const handleScroll = () => {
    throttledScrollHandler();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">성능 최적화 Hook 예시</h2>

      {/* Memoized Callback Example */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">useMemoizedCallback 예시</h3>
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setCount(prev => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              카운트 증가 ({count})
            </button>
            <button
              onClick={handleCalculate}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              비용이 큰 계산 실행
            </button>
          </div>
          <p className="text-sm text-gray-600">
            결과: {expensiveResult.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            • 같은 입력값으로 5초 내에 다시 호출하면 캐시된 결과를 반환합니다
            • 콘솔에서 "Expensive calculation executed!" 메시지를 확인하세요
          </p>
        </div>
      </div>

      {/* Throttle Example */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">useThrottle 예시</h3>
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <button
              onClick={handleScroll}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              스크롤 이벤트 시뮬레이션
            </button>
            <span className="text-lg font-medium">
              스크롤 카운트: {scrollCount}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            • 버튼을 빠르게 클릭해도 100ms마다만 카운트가 증가합니다
          </p>
        </div>
      </div>

      {/* Debounce Example */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">useDebounce 예시</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="w-full px-4 py-2 border rounded-lg"
          />
          <div className="space-y-2">
            <p className="text-sm">
              <strong>실시간 입력:</strong> {searchTerm}
            </p>
            <p className="text-sm">
              <strong>디바운스된 값:</strong> {debouncedSearchTerm}
            </p>
          </div>
          <p className="text-xs text-gray-500">
            • 입력을 멈춘 후 500ms 후에 디바운스된 값이 업데이트됩니다
          </p>
        </div>
      </div>

      {/* Intersection Observer Example */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">useIntersectionObserver 예시</h3>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">스크롤하여 아래 요소를 확인하세요</p>
          </div>
          
          <div 
            ref={ref}
            className={`h-32 rounded-lg flex items-center justify-center transition-colors duration-300 ${
              isVisible 
                ? 'bg-green-200 text-green-800' 
                : 'bg-red-200 text-red-800'
            }`}
          >
            <div className="text-center">
              <p className="font-semibold">
                {isVisible ? '보임' : '숨김'}
              </p>
              <p className="text-sm">
                {isVisible ? '이 요소가 화면에 보입니다' : '이 요소가 화면에 보이지 않습니다'}
              </p>
            </div>
          </div>
          
          <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">더 스크롤하세요</p>
          </div>
          
          <p className="text-xs text-gray-500">
            • 요소가 50% 이상 보일 때 상태가 변경됩니다
            • rootMargin: 50px로 설정되어 있어 요소가 화면에 들어오기 50px 전에 감지됩니다
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">사용 방법</h3>
        <ul className="space-y-2 text-sm">
          <li>• <strong>useMemoizedCallback:</strong> 비용이 큰 계산을 캐싱하여 성능을 향상시킵니다</li>
          <li>• <strong>useThrottle:</strong> 함수 호출을 제한하여 과도한 실행을 방지합니다</li>
          <li>• <strong>useDebounce:</strong> 연속된 입력을 그룹화하여 불필요한 API 호출을 줄입니다</li>
          <li>• <strong>useIntersectionObserver:</strong> 요소의 가시성을 효율적으로 감지합니다</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceHooksExample; 