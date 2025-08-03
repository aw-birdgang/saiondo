import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';
import { useChannelStore } from '../../../stores/channelStore';
import { useDataLoader } from "../../hooks/useDataLoader";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Button,
  LoadingSpinner,
  Skeleton,
  Badge,
  StatusBadge,
  CounterBadge
} from "../../components/common";
import { useToastContext } from "../../providers/ToastProvider";
import { cn } from '../../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className 
}) => (
  <Card className={cn("hover:shadow-lg transition-all duration-300", className)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-txt-secondary">{title}</p>
          <p className="text-3xl font-bold text-txt mt-2">{value}</p>
          <p className="text-sm text-txt-secondary mt-1">{description}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-txt-secondary ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <div className="text-primary">
            {icon}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ 
  title, 
  description, 
  icon, 
  href, 
  color,
  badge
}) => (
  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
    <CardContent className="p-6">
      <div className="flex items-start space-x-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 relative",
          color
        )}>
          <div className="text-white">
            {icon}
          </div>
          {badge && (
            <CounterBadge 
              count={parseInt(badge)} 
              className="absolute -top-2 -right-2"
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-txt group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-txt-secondary mt-1">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { loading, fetchCurrentUser } = useUserStore();
  const { channels, fetchChannelsByUserId } = useChannelStore();
  const [greeting, setGreeting] = useState('');
  const toast = useToastContext();

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('좋은 아침입니다');
    } else if (hour < 18) {
      setGreeting('좋은 오후입니다');
    } else {
      setGreeting('좋은 저녁입니다');
    }
  }, []);

  // 임시로 데이터 로딩을 비활성화하여 무한 로딩 문제 해결
  const { loadData: loadHomeData } = useDataLoader(
    async () => {
      console.log('HomePage data loading disabled temporarily');
    },
    [user?.id, fetchCurrentUser, fetchChannelsByUserId],
    { autoLoad: false }
  );

  const quickActions: QuickActionProps[] = [
    {
      title: '새 채팅 시작',
      description: '새로운 대화를 시작하세요',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      href: '/chat',
      color: 'bg-blue-500',
      badge: '3'
    },
    {
      title: '채널 생성',
      description: '새로운 채널을 만들어보세요',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      href: '/channels',
      color: 'bg-green-500'
    },
    {
      title: 'AI 어시스턴트',
      description: 'AI와 대화해보세요',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      href: '/assistant',
      color: 'bg-purple-500',
      badge: '1'
    },
    {
      title: '데이터 분석',
      description: '통계를 확인해보세요',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: '/analysis',
      color: 'bg-orange-500'
    }
  ];

  const handleQuickAction = (action: QuickActionProps) => {
    toast.success(`${action.title}으로 이동합니다!`);
    // 실제로는 라우터를 사용하여 이동
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-txt">
            {greeting}, {user?.name || '사용자'}님! 👋
          </h1>
          <p className="text-txt-secondary mt-2">
            오늘도 Saiondo와 함께 즐거운 하루를 보내세요
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-3">
          <StatusBadge status="online" />
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 프로젝트
          </Button>
          <Button size="sm" onClick={() => toast.info('새로운 기능이 곧 출시됩니다!')}>
            시작하기
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 채팅"
          value="1,234"
          description="이번 달 총 채팅 수"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="활성 채널"
          value="56"
          description="현재 활성 채널 수"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="AI 상호작용"
          value="89"
          description="AI와의 상호작용 수"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          trend={{ value: 23, isPositive: true }}
        />
        <StatCard
          title="만족도"
          value="4.8"
          description="평균 만족도 점수"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-txt">빠른 시작</h2>
          <Badge variant="info">새로운 기능</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div key={index} onClick={() => handleQuickAction(action)}>
              <QuickAction {...action} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>최근 7일간의 활동 내역입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '2시간 전', action: '새 채팅방 생성', user: '김철수', status: 'success' as const },
                { time: '4시간 전', action: 'AI 어시스턴트 사용', user: '이영희', status: 'online' as const },
                { time: '6시간 전', action: '채널 참여', user: '박민수', status: 'away' as const },
                { time: '1일 전', action: '데이터 분석 실행', user: '최지영', status: 'offline' as const },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-txt">{item.action}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-txt-secondary">{item.user} • {item.time}</p>
                      <StatusBadge status={item.status} showText={false} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>시스템 상태</CardTitle>
            <CardDescription>현재 시스템 상태를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: '채팅 서버', status: '정상', color: 'text-green-600', badge: 'success' as const },
                { service: 'AI 서비스', status: '정상', color: 'text-green-600', badge: 'success' as const },
                { service: '데이터베이스', status: '정상', color: 'text-green-600', badge: 'success' as const },
                { service: '파일 스토리지', status: '점검 중', color: 'text-yellow-600', badge: 'warning' as const },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-txt">{item.service}</span>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={item.badge} showText={false} size="sm" />
                    <span className={cn("text-sm font-medium", item.color)}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
