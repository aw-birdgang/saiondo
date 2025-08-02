import React, { useState } from 'react';
import { useUserController } from '../../providers/ControllerProvider';
import { ControllerFactory } from '../../../application/controllers/ControllerFactory';

/**
 * Controller 패턴 사용 예시 컴포넌트
 */
export const ControllerUsageExample: React.FC = () => {
  const userController = useUserController();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCurrentUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await userController.executeWithTracking(
        'getCurrentUser',
        {},
        async () => {
          // 실제 비즈니스 로직 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 1000));
          return {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://via.placeholder.com/150'
          };
        }
      );
      
      setResult(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticateUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await userController.executeWithTracking(
        'authenticateUser',
        { email: 'test@example.com', password: 'password123' },
        async () => {
          // 실제 인증 로직 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 1500));
          return {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            avatar: 'https://via.placeholder.com/150'
          };
        }
      );
      
      setResult(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await userController.executeWithTracking(
        'registerUser',
        { 
          email: 'newuser@example.com', 
          password: 'password123', 
          name: 'New User' 
        },
        async () => {
          // 실제 등록 로직 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 2000));
          return {
            id: '3',
            name: 'New User',
            email: 'newuser@example.com',
            avatar: 'https://via.placeholder.com/150'
          };
        }
      );
      
      setResult(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getFactoryInfo = () => {
    const factory = ControllerFactory.getInstance();
    return factory.getFactoryInfo();
  };

  const getControllerStats = () => {
    const factory = ControllerFactory.getInstance();
    return factory.getControllerStats();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Controller 패턴 사용 예시
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controller 실행 예시 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Controller 실행
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handleGetCurrentUser}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '실행 중...' : '현재 사용자 조회'}
              </button>
              
              <button
                onClick={handleAuthenticateUser}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '실행 중...' : '사용자 인증'}
              </button>

              <button
                onClick={handleRegisterUser}
                disabled={loading}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '실행 중...' : '사용자 등록'}
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">결과</h4>
                <pre className="text-sm text-green-700 dark:text-green-300 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">에러</h4>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>

          {/* Controller 상태 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Controller 상태
            </h3>
            
            <div className="space-y-3">
              {/* Factory 정보 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Factory 정보</h4>
                <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <div>총 Controller: {getFactoryInfo().totalControllers}</div>
                  <div>활성 Controller: {getFactoryInfo().activeControllers}</div>
                  <div>Controller 타입: {getFactoryInfo().controllerTypes.join(', ')}</div>
                </div>
              </div>

              {/* UserController 상태 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">UserController 상태</h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div>초기화: {userController.isActive() ? '완료' : '대기'}</div>
                  <div>총 작업: {userController.getMetrics().totalOperations}</div>
                  <div>성공: {userController.getMetrics().successfulOperations}</div>
                  <div>실패: {userController.getMetrics().failedOperations}</div>
                  <div>평균 시간: {userController.getMetrics().averageExecutionTime.toFixed(2)}ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controller 흐름 추적 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            흐름 추적
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>✅ Controller 패턴으로 비즈니스 로직 분리</div>
              <div>✅ 미들웨어를 통한 실행 전후 처리</div>
              <div>✅ 흐름 추적 및 성능 모니터링</div>
              <div>✅ 에러 처리 및 로깅</div>
              <div>✅ Factory 패턴으로 동적 Controller 관리</div>
              <div>✅ 검증 미들웨어로 입력 파라미터 검증</div>
              <div>✅ 캐싱 미들웨어로 성능 최적화</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 