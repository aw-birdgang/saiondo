import React from 'react';
import { cn } from '../../../../utils/cn';
import type { ProfileSectionProps } from '../../../pages/mypage/types/mypageTypes';

const ProfileSection: React.FC<ProfileSectionProps> = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  className
}) => {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden",
      "transition-all duration-300",
      isEditing && "ring-2 ring-blue-200 dark:ring-blue-800",
      className
    )}>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              내 프로필
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              프로필 정보를 관리하고 개인화된 경험을 설정하세요
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={onSave}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  aria-label="프로필 저장"
                >
                  <span>✓</span>
                  저장
                </button>
                <button 
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors text-sm font-medium rounded-lg"
                  aria-label="편집 취소"
                >
                  취소
                </button>
              </>
            ) : (
              <button 
                onClick={onEdit}
                className="px-4 py-2 border border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium rounded-lg flex items-center gap-2"
                aria-label="프로필 편집"
              >
                <span>✏️</span>
                편집
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 프로필 콘텐츠 */}
      <div className={cn(
        "p-6 transition-all duration-300",
        isEditing && "bg-blue-50/30 dark:bg-blue-900/5"
      )}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 프로필 이미지 및 기본 정보 */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  👤
                </div>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-sm transition-colors">
                    📷
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  사용자 이름
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  user@example.com
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>📅</span>
                <span>2024년 1월부터 활동</span>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 개인 정보 */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  개인 정보
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">이름</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">홍길동</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">닉네임</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">길동이</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">생년월일</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">1990년 1월 1일</span>
                  </div>
                </div>
              </div>

              {/* 계정 정보 */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  계정 정보
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">이메일</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">user@example.com</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">전화번호</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">010-1234-5678</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">가입일</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">2024년 1월 15일</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                추가 정보
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">목표</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">AI 전문가</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🌍</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">지역</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">서울시</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">직업</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">개발자</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection; 