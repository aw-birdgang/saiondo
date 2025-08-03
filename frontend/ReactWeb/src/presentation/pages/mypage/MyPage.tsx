import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../../../shared/constants/app";
import { useAuth } from '../../../contexts/AuthContext';
import { 
  UserProfile, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Button,
  Badge,
  StatusBadge,
  ProgressBar,
  Skeleton
} from '../../components/common';
import { useToastContext } from '../../providers/ToastProvider';
import { cn } from '../../../utils/cn';

const MyPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const toast = useToastContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast.success('로그아웃되었습니다.');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    toast.info('프로필 편집 모드로 전환되었습니다.');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success('프로필이 저장되었습니다.');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    toast.info('편집이 취소되었습니다.');
  };

  // 활동 통계 데이터
  const activityStats = [
    { label: '총 채팅', value: '1,234', trend: '+12%', color: 'text-blue-600' },
    { label: '참여 채널', value: '56', trend: '+8%', color: 'text-green-600' },
    { label: 'AI 상호작용', value: '89', trend: '+23%', color: 'text-purple-600' },
    { label: '만족도', value: '4.8', trend: '+5%', color: 'text-yellow-600' },
  ];

  // 최근 활동 데이터
  const recentActivities = [
    { id: 1, action: '새 채팅방 생성', time: '2시간 전', type: 'chat' as const },
    { id: 2, action: 'AI 어시스턴트 사용', time: '4시간 전', type: 'ai' as const },
    { id: 3, action: '채널 참여', time: '6시간 전', type: 'channel' as const },
    { id: 4, action: '데이터 분석 실행', time: '1일 전', type: 'analysis' as const },
  ];

  const getActivityIcon = (type: 'chat' | 'ai' | 'channel' | 'analysis') => {
    switch (type) {
      case 'chat': return '💬';
      case 'ai': return '🤖';
      case 'channel': return '👥';
      case 'analysis': return '📊';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>내 프로필</CardTitle>
              <CardDescription>프로필 정보를 관리하세요</CardDescription>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSaveProfile}>
                    저장
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    취소
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={handleEditProfile}>
                  편집
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UserProfile
            showEditButton={false}
            showMemberSince
            size="lg"
          />
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activityStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-txt-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold text-txt">{stat.value}</p>
                </div>
                <div className={cn("text-sm font-medium", stat.color)}>
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>최근 7일간의 활동 내역입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-txt">{activity.action}</p>
                    <p className="text-xs text-txt-secondary">{activity.time}</p>
                  </div>
                  <StatusBadge status="success" showText={false} size="sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 액션</CardTitle>
            <CardDescription>자주 사용하는 기능에 빠르게 접근하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => navigate('/chat')}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
              >
                새 채팅 시작
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => navigate('/channels')}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
              >
                채널 관리
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => navigate('/assistant')}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                }
              >
                AI 어시스턴트
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Progress */}
      <Card>
        <CardHeader>
          <CardTitle>계정 완성도</CardTitle>
          <CardDescription>프로필 완성도를 높여 더 나은 서비스를 이용하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProgressBar progress={75} showPercentage variant="success" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>프로필 정보</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>이메일 인증</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>프로필 사진</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Section */}
      <Card>
        <CardHeader>
          <CardTitle>계정 관리</CardTitle>
          <CardDescription>계정 관련 설정을 관리하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('/settings')}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              설정
            </Button>
            <Button
              variant="destructive"
              fullWidth
              onClick={handleLogout}
              disabled={isLoading}
              loading={isLoading}
              loadingText="로그아웃 중..."
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
            >
              로그아웃
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPage; 