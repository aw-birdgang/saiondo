import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '@/presentation/providers/ToastProvider';
import { AuthGuard } from '@/presentation/components';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Avatar,
  Badge,
  Skeleton,
  GlassmorphicCard,
  NeumorphicCard,
  FloatingActionButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/presentation/components/common';
import { useIntersectionAnimation, useStaggerAnimation } from '@/shared/design-system/animations';
import { useTheme } from '@/shared/design-system/hooks';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinDate: Date;
  isOnline: boolean;
}

interface Activity {
  id: string;
  type: 'message' | 'file' | 'reaction' | 'login';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

const ModernMyPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastContext();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Animation hooks
  const { elementRef: headerRef } = useIntersectionAnimation('slideInDown', 0.1, '0px');
  const { elementRef: statsRef } = useIntersectionAnimation('fadeIn', 0.2, '0px');
  const { elementRef: profileRef } = useIntersectionAnimation('slideInUp', 0.3, '0px');

  // Mock data
  const [profile, setProfile] = useState<Profile>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/150',
    bio: '프론트엔드 개발자로서 사용자 경험을 개선하는 것에 열정을 가지고 있습니다.',
    location: '서울, 대한민국',
    website: 'https://johndoe.dev',
    joinDate: new Date('2023-01-15'),
    isOnline: true,
  });

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'message',
      title: '새 메시지 전송',
      description: '프로젝트 팀 채팅방에 메시지를 보냈습니다.',
      timestamp: new Date(Date.now() - 300000),
      icon: '💬',
    },
    {
      id: '2',
      type: 'file',
      title: '파일 업로드',
      description: '프로젝트 문서를 업로드했습니다.',
      timestamp: new Date(Date.now() - 600000),
      icon: '📁',
    },
    {
      id: '3',
      type: 'reaction',
      title: '메시지에 반응',
      description: '팀원의 메시지에 👍 반응을 남겼습니다.',
      timestamp: new Date(Date.now() - 900000),
      icon: '👍',
    },
    {
      id: '4',
      type: 'login',
      title: '로그인',
      description: '새로운 기기에서 로그인했습니다.',
      timestamp: new Date(Date.now() - 3600000),
      icon: '🔐',
    },
  ]);

  const [stats] = useState<Stat[]>([
    {
      label: '총 메시지',
      value: '1,234',
      change: '+12%',
      icon: '💬',
      color: 'text-blue-600',
    },
    {
      label: '활성 채널',
      value: '8',
      change: '+2',
      icon: '📢',
      color: 'text-green-600',
    },
    {
      label: '업로드 파일',
      value: '45',
      change: '+5',
      icon: '📁',
      color: 'text-purple-600',
    },
    {
      label: '반응 수',
      value: '89',
      change: '+15%',
      icon: '👍',
      color: 'text-orange-600',
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
    toast.success('프로필 편집 모드를 시작합니다.');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success('프로필이 성공적으로 저장되었습니다.');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    toast.info('프로필 편집이 취소되었습니다.');
  };

  const handleLogout = () => {
    toast.success('로그아웃되었습니다.');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full lg:col-span-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header ref={headerRef} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar
                  src={profile.avatar}
                  fallback={profile.name.charAt(0)}
                  size="xl"
                  className="ring-4 ring-primary/20"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profile.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {profile.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="success" className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>온라인</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === 'dark' ? '🌞' : '🌙'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <span>📊</span>
                <span>개요</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <span>👤</span>
                <span>프로필</span>
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center space-x-2">
                <span>📝</span>
                <span>활동</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <span>⚙️</span>
                <span>설정</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Section */}
              <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <GlassmorphicCard key={index} className="p-6 text-center">
                    <div className={`text-3xl mb-2 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {stat.label}
                    </div>
                    <Badge variant="success" className="text-xs">
                      {stat.change}
                    </Badge>
                  </GlassmorphicCard>
                ))}
              </div>

              {/* Quick Actions */}
              <Card variant="modern" className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>⚡</span>
                    <span>빠른 액션</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: '💬', title: '새 메시지', action: () => navigate('/chat') },
                      { icon: '📁', title: '파일 업로드', action: () => toast.info('파일 업로드') },
                      { icon: '👥', title: '팀 초대', action: () => navigate('/invite') },
                      { icon: '📊', title: '분석 보기', action: () => navigate('/analysis') },
                    ].map((action, index) => (
                      <NeumorphicCard
                        key={index}
                        className="p-4 text-center cursor-pointer hover:scale-105 transition-transform"
                        onClick={action.action}
                      >
                        <div className="text-2xl mb-2">{action.icon}</div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {action.title}
                        </div>
                      </NeumorphicCard>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div ref={profileRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <Card variant="modern" className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>프로필 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <Avatar
                        src={profile.avatar}
                        fallback={profile.name.charAt(0)}
                        size="xl"
                        className="mx-auto mb-4 ring-4 ring-primary/20"
                      />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {profile.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.email}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          자기소개
                        </label>
                        {isEditing ? (
                          <Input
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            variant="modern"
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {profile.bio}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          위치
                        </label>
                        {isEditing ? (
                          <Input
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            variant="modern"
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {profile.location}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          웹사이트
                        </label>
                        {isEditing ? (
                          <Input
                            value={profile.website}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            variant="modern"
                            className="mt-1"
                          />
                        ) : (
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1 block"
                          >
                            {profile.website}
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Stats */}
                <Card variant="modern" className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>계정 통계</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">가입일</span>
                          <span className="font-medium">
                            {profile.joinDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">상태</span>
                          <Badge variant="success">활성</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">마지막 로그인</span>
                          <span className="font-medium">방금 전</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">총 메시지</span>
                          <span className="font-medium">1,234</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">활성 채널</span>
                          <span className="font-medium">8</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">업로드 파일</span>
                          <span className="font-medium">45</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      취소
                    </Button>
                    <Button variant="primary" onClick={handleSaveProfile}>
                      저장
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={handleEditProfile}>
                    프로필 편집
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              <Card variant="modern">
                <CardHeader>
                  <CardTitle>최근 활동</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="text-2xl">{activity.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card variant="modern">
                <CardHeader>
                  <CardTitle>계정 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">다크 모드</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        테마를 다크 모드로 변경합니다
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTheme}
                    >
                      {theme === 'dark' ? '라이트 모드' : '다크 모드'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">알림 설정</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        푸시 알림을 관리합니다
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('알림 설정')}
                    >
                      설정
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">개인정보 보호</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        개인정보 보호 설정을 관리합니다
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('개인정보 보호 설정')}
                    >
                      설정
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/10">
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-100">로그아웃</h4>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        현재 계정에서 로그아웃합니다
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleLogout}
                    >
                      로그아웃
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
          label="새 활동"
          variant="primary"
          size="lg"
          position="bottom-right"
          onClick={() => toast.success('새 활동을 시작합니다!')}
        />
      </div>
    </AuthGuard>
  );
};

export default ModernMyPage; 