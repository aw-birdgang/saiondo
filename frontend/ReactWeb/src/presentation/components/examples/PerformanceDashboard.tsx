import React, { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [slowestHooks, setSlowestHooks] = useState<any[]>([]);
  const [averageTime, setAverageTime] = useState(0);
  const [totalMetrics, setTotalMetrics] = useState(0);
  const [selectedHook, setSelectedHook] = useState<string>('');
  const [hookMetrics, setHookMetrics] = useState<any[]>([]);

  const {
    getMetrics,
    getMetricsByHook,
    getAverageExecutionTime,
    getSlowestHooks,
    clearMetrics,
    exportMetrics
  } = usePerformanceMonitor();

  // Refresh metrics every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const allMetrics = getMetrics();
      const slowest = getSlowestHooks(10);
      const avgTime = getAverageExecutionTime();

      setMetrics(allMetrics);
      setSlowestHooks(slowest);
      setAverageTime(avgTime);
      setTotalMetrics(allMetrics.length);

      if (selectedHook) {
        setHookMetrics(getMetricsByHook(selectedHook));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [getMetrics, getSlowestHooks, getAverageExecutionTime, getMetricsByHook, selectedHook]);

  const handleExport = () => {
    const data = exportMetrics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (ms: number) => {
    if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getTimeColor = (ms: number) => {
    if (ms < 10) return 'text-green-600';
    if (ms < 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">성능 모니터링 대시보드</h2>
        <p className="text-gray-600">
          Custom Hook들의 성능을 실시간으로 모니터링합니다
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">총 메트릭</h3>
          <p className="text-3xl font-bold text-blue-600">{totalMetrics}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">평균 실행 시간</h3>
          <p className={`text-3xl font-bold ${getTimeColor(averageTime)}`}>
            {formatTime(averageTime)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">모니터링된 Hook</h3>
          <p className="text-3xl font-bold text-green-600">
            {slowestHooks.length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">최고 성능</h3>
          <p className="text-3xl font-bold text-purple-600">
            {slowestHooks.length > 0 ? formatTime(slowestHooks[slowestHooks.length - 1]?.avgTime || 0) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={clearMetrics}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          메트릭 초기화
        </button>
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          데이터 내보내기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Slowest Hooks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">가장 느린 Hook들</h3>
          <div className="space-y-3">
            {slowestHooks.map((hook, index) => (
              <div
                key={hook.hookName}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedHook(hook.hookName)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">{hook.hookName}</p>
                    <p className="text-sm text-gray-500">
                      평균 실행 시간
                    </p>
                  </div>
                </div>
                <span className={`text-lg font-bold ${getTimeColor(hook.avgTime)}`}>
                  {formatTime(hook.avgTime)}
                </span>
              </div>
            ))}
            {slowestHooks.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                아직 수집된 메트릭이 없습니다
              </p>
            )}
          </div>
        </div>

        {/* Hook Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">
            {selectedHook ? `${selectedHook} 상세 정보` : 'Hook 선택'}
          </h3>
          {selectedHook ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">총 실행 횟수:</span>
                <span>{hookMetrics.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">평균 실행 시간:</span>
                <span className={getTimeColor(getAverageExecutionTime(selectedHook))}>
                  {formatTime(getAverageExecutionTime(selectedHook))}
                </span>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">최근 실행 기록</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {hookMetrics.slice(-10).reverse().map((metric, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                      <span>{new Date(metric.timestamp).toLocaleTimeString()}</span>
                      <span className={getTimeColor(metric.executionTime)}>
                        {formatTime(metric.executionTime)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              왼쪽에서 Hook을 선택하여 상세 정보를 확인하세요
            </p>
          )}
        </div>
      </div>

      {/* Recent Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">최근 메트릭</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Hook</th>
                <th className="text-left p-2">실행 시간</th>
                <th className="text-left p-2">시간</th>
                <th className="text-left p-2">상태</th>
              </tr>
            </thead>
            <tbody>
              {metrics.slice(-20).reverse().map((metric, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{metric.hookName}</td>
                  <td className={`p-2 font-bold ${getTimeColor(metric.executionTime)}`}>
                    {formatTime(metric.executionTime)}
                  </td>
                  <td className="p-2 text-sm text-gray-500">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-2">
                    {metric.error ? (
                      <span className="text-red-500 text-sm">오류</span>
                    ) : (
                      <span className="text-green-500 text-sm">성공</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {metrics.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            아직 수집된 메트릭이 없습니다
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">사용 방법</h3>
        <ul className="space-y-2 text-sm">
          <li>• 성능 모니터링을 활성화하려면 Custom Hook에서 <code>enablePerformanceMonitoring: true</code> 옵션을 설정하세요</li>
          <li>• 메트릭은 실시간으로 업데이트됩니다 (2초마다)</li>
          <li>• 데이터를 내보내서 분석에 활용할 수 있습니다</li>
          <li>• Hook을 클릭하여 상세 정보를 확인할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceDashboard; 