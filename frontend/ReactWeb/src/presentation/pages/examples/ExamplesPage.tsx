import React from 'react';
import { Link } from 'react-router-dom';
import InfiniteScrollExample from '../../components/examples/InfiniteScrollExample';
import AsyncStateExample from '../../components/examples/AsyncStateExample';
import PerformanceHooksExample from '../../components/examples/PerformanceHooksExample';
import PerformanceDashboard from '../../components/examples/PerformanceDashboard';
import MonitoredDataLoaderExample from '../../components/examples/MonitoredDataLoaderExample';

const ExamplesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Custom Hooks 예시 모음
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ReactWeb 프로젝트에서 생성한 Custom Hook들의 실제 사용 예시를 확인해보세요.
            각 예시는 실제 개발에서 활용할 수 있는 패턴들을 보여줍니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Navigation Cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              🚀 고급 조합 Hooks
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-lg">useInfiniteScroll</h3>
                <p className="text-gray-600 text-sm mb-2">
                  무한 스크롤 기능을 구현하는 Hook
                </p>
                <Link
                  to="#infinite-scroll"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  예시 보기 →
                </Link>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg">useAsyncState</h3>
                <p className="text-gray-600 text-sm mb-2">
                  비동기 상태 관리를 위한 Hook
                </p>
                <Link
                  to="#async-state"
                  className="text-green-500 hover:text-green-700 text-sm font-medium"
                >
                  예시 보기 →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">
              ⚡ 성능 최적화 Hooks
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-lg">useMemoizedCallback</h3>
                <p className="text-gray-600 text-sm mb-2">
                  메모이제이션된 콜백으로 성능 최적화
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-lg">useThrottle & useDebounce</h3>
                <p className="text-gray-600 text-sm mb-2">
                  함수 호출 제한으로 성능 향상
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-lg">useIntersectionObserver</h3>
                <p className="text-gray-600 text-sm mb-2">
                  요소 가시성 감지로 효율적인 렌더링
                </p>
              </div>
              
              <Link
                to="#performance-hooks"
                className="text-purple-500 hover:text-purple-700 text-sm font-medium"
              >
                모든 성능 최적화 예시 보기 →
              </Link>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-16">
          {/* Performance Dashboard */}
          <section id="performance-dashboard" className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-500 text-white p-6">
                <h2 className="text-2xl font-bold">성능 모니터링 대시보드</h2>
                <p className="text-indigo-100 mt-2">
                  Custom Hook들의 성능을 실시간으로 모니터링하고 분석
                </p>
              </div>
              <div className="p-6">
                <PerformanceDashboard />
              </div>
            </div>
          </section>

          {/* Monitored Data Loader Example */}
          <section id="monitored-data-loader" className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-orange-500 text-white p-6">
                <h2 className="text-2xl font-bold">성능 모니터링 데이터 로더</h2>
                <p className="text-orange-100 mt-2">
                  useDataLoader Hook의 성능 모니터링 기능을 실시간으로 확인
                </p>
              </div>
              <div className="p-6">
                <MonitoredDataLoaderExample />
              </div>
            </div>
          </section>

          {/* Infinite Scroll Example */}
          <section id="infinite-scroll" className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-500 text-white p-6">
                <h2 className="text-2xl font-bold">무한 스크롤 예시</h2>
                <p className="text-blue-100 mt-2">
                  useInfiniteScroll Hook을 사용한 메시지 목록
                </p>
              </div>
              <div className="p-6">
                <InfiniteScrollExample />
              </div>
            </div>
          </section>

          {/* Async State Example */}
          <section id="async-state" className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-500 text-white p-6">
                <h2 className="text-2xl font-bold">비동기 상태 관리 예시</h2>
                <p className="text-green-100 mt-2">
                  useAsyncState Hook을 사용한 사용자 정보 로딩
                </p>
              </div>
              <div className="p-6">
                <AsyncStateExample />
              </div>
            </div>
          </section>

          {/* Performance Hooks Example */}
          <section id="performance-hooks" className="scroll-mt-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-purple-500 text-white p-6">
                <h2 className="text-2xl font-bold">성능 최적화 Hook 예시</h2>
                <p className="text-purple-100 mt-2">
                  다양한 성능 최적화 Hook들의 실제 사용법
                </p>
              </div>
              <div className="p-6">
                <PerformanceHooksExample />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold mb-4">더 많은 정보</h3>
            <p className="text-gray-600 mb-6">
              모든 Custom Hook의 자세한 사용법과 API 문서는 README.md 파일에서 확인할 수 있습니다.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                홈으로 돌아가기
              </Link>
              <a
                href="https://github.com/your-repo/reactweb"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                GitHub 저장소
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesPage; 