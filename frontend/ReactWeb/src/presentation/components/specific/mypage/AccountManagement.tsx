import React from 'react';
import { cn } from '../../../../utils/cn';
import type { AccountManagementProps } from '../../../pages/mypage/types/mypageTypes';

const AccountManagement: React.FC<AccountManagementProps> = ({
  onLogout,
  onSettings,
  isLoading,
  className
}) => {
  const settingsOptions = [
    {
      id: 'profile',
      title: '프로필 설정',
      description: '개인 정보 및 프로필 관리',
      icon: '👤',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10'
    },
    {
      id: 'security',
      title: '보안 설정',
      description: '비밀번호 및 2단계 인증',
      icon: '🔒',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/10'
    },
    {
      id: 'notifications',
      title: '알림 설정',
      description: '앱 알림 및 이메일 설정',
      icon: '🔔',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/10'
    },
    {
      id: 'privacy',
      title: '개인정보 보호',
      description: '데이터 사용 및 개인정보 설정',
      icon: '🛡️',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/10'
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            계정 관리
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            계정 관련 설정을 관리하세요
          </p>
        </div>
      </div>

      {/* 설정 옵션 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsOptions.map((option) => (
          <button
            key={option.id}
            onClick={onSettings}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg",
              "transition-all duration-300 transform hover:-translate-y-1",
              "cursor-pointer text-left"
            )}
          >
            {/* 배경 그라데이션 */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300",
              option.bgColor
            )} />
            
            <div className="relative p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xl shadow-lg",
                  "transition-all duration-200 group-hover:scale-110",
                  option.color
                )}>
                  {option.icon}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {option.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
                
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">→</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 계정 상태 */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                계정 상태
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                정상적으로 작동 중
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              활성
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              상태
            </p>
          </div>
        </div>
      </div>

      {/* 로그아웃 섹션 */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-lg p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🚪</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                로그아웃
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                현재 계정에서 로그아웃합니다
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-yellow-600 dark:text-yellow-400 text-sm">⚠️</span>
            <div>
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                보안 알림
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                로그아웃 시 모든 세션이 종료되며, 다시 로그인해야 합니다.
              </p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            disabled={isLoading}
            className={cn(
              "w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg",
              "transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none",
              "font-medium text-sm flex items-center justify-center gap-2"
            )}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                로그아웃 중...
              </>
            ) : (
              <>
                <span>🚪</span>
                로그아웃
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement; 