import React, { useState, useEffect } from 'react';
import { useControllerStats } from '../../providers/ControllerProvider';
import { ControllerFactory } from '../../../application/controllers/ControllerFactory';

interface FlowInfo {
  id: string;
  controller: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success?: boolean;
  error?: any;
}

export const ControllerMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [activeTab, setActiveTab] = useState<'overview' | 'flows' | 'performance' | 'factory' | 'middleware'>('overview');
  const stats = useControllerStats();

  // 자동 갱신
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      // 강제로 stats를 다시 계산
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isVisible, refreshInterval]);

  const getStatusColor = (successRate: number) => {
    if (successRate >= 95) return 'text-green-500';
    if (successRate >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getFactoryInfo = () => {
    const factory = ControllerFactory.getInstance();
    return factory.getFactoryInfo();
  };

  const getControllerStats = () => {
    const factory = ControllerFactory.getInstance();
    return factory.getControllerStats();
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 z-50"
        title="Controller 모니터링"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Controller 모니터링
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="text-xs px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value={1000}>1초</option>
            <option value={5000}>5초</option>
            <option value={10000}>10초</option>
          </select>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: '개요' },
          { id: 'flows', label: '흐름' },
          { id: 'performance', label: '성능' },
          { id: 'factory', label: 'Factory' },
          { id: 'middleware', label: '미들웨어' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 컨텐츠 */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Factory 정보 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Factory 상태</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-300">
                <div>총 Controller: {getFactoryInfo().totalControllers}</div>
                <div>활성 Controller: {getFactoryInfo().activeControllers}</div>
              </div>
            </div>

            {/* Controller 상태들 */}
            {Object.entries(stats).map(([controllerName, controllerStats]) => (
              <div key={controllerName} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{controllerName}</h4>
                  <span className={`text-sm font-medium ${getStatusColor(controllerStats.successRate)}`}>
                    {controllerStats.successRate.toFixed(1)}% 성공률
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div>총 흐름: {controllerStats.totalFlows}</div>
                  <div>활성 흐름: {controllerStats.activeFlows.length}</div>
                  <div>초기화: {controllerStats.isInitialized ? '완료' : '대기'}</div>
                  <div>마지막 활동: {controllerStats.lastActivity.toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'flows' && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">활성 흐름</h4>
            {Object.entries(stats).map(([controllerName, controllerStats]) => 
              controllerStats.activeFlows.map((flow: any) => (
                <div key={flow.id} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-yellow-900 dark:text-yellow-100">
                        {controllerName}.{flow.operation}
                      </div>
                      <div className="text-xs text-yellow-700 dark:text-yellow-300">
                        ID: {flow.id}
                      </div>
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      {formatTime(flow.startTime)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">성능 메트릭</h4>
            {Object.entries(getControllerStats()).map(([controllerName, controllerStats]) => (
              <div key={controllerName} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">{controllerName}</h5>
                <div className="grid grid-cols-2 gap-2 text-xs text-green-700 dark:text-green-300">
                  <div>총 작업: {controllerStats.metrics.totalOperations}</div>
                  <div>성공: {controllerStats.metrics.successfulOperations}</div>
                  <div>실패: {controllerStats.metrics.failedOperations}</div>
                  <div>평균 시간: {formatDuration(controllerStats.metrics.averageExecutionTime)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'factory' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Factory 정보</h4>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                <div>총 Controller: {getFactoryInfo().totalControllers}</div>
                <div>활성 Controller: {getFactoryInfo().activeControllers}</div>
                <div>Controller 타입: {getFactoryInfo().controllerTypes.join(', ')}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'middleware' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">미들웨어 상태</h4>
            
            {/* Validation Middleware */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
              <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Validation Middleware</h5>
              <div className="space-y-1 text-xs text-orange-700 dark:text-orange-300">
                <div>우선순위: 5 (최고)</div>
                <div>기능: 입력 파라미터 검증</div>
                <div>상태: 활성</div>
              </div>
            </div>

            {/* Logging Middleware */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Logging Middleware</h5>
              <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                <div>우선순위: 10</div>
                <div>기능: 실행 전후 로깅</div>
                <div>상태: 활성</div>
              </div>
            </div>

            {/* Caching Middleware */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">Caching Middleware</h5>
              <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
                <div>우선순위: 30</div>
                <div>기능: 결과 캐싱</div>
                <div>상태: 활성</div>
              </div>
            </div>

            {/* Performance Middleware */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
              <h5 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Performance Middleware</h5>
              <div className="space-y-1 text-xs text-indigo-700 dark:text-indigo-300">
                <div>우선순위: 20</div>
                <div>기능: 성능 메트릭 추적</div>
                <div>상태: 활성</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 