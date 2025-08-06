import React, { useState, useEffect } from 'react';
import { useToastContext } from '../../providers/ToastProvider';
import { AuthGuard } from '../../components/specific';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Badge,
  Skeleton,
  GlassmorphicCard,
  NeumorphicCard,
  FloatingActionButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../components/common';
import { useIntersectionAnimation, useStaggerAnimation } from '../../../shared/design-system/animations';
import { useTheme } from '../../../shared/design-system/hooks';

interface AnalysisData {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'processing' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  metrics: {
    totalMessages: number;
    activeUsers: number;
    engagementRate: number;
    responseTime: number;
  };
  charts: {
    messageTrend: number[];
    userActivity: number[];
    channelPerformance: { name: string; value: number }[];
  };
}

const ModernAnalysisPage: React.FC = () => {
  const toast = useToastContext();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');

  // Animation hooks
  const { elementRef: headerRef } = useIntersectionAnimation('slideInDown', 0.1, '0px');
  const { elementRef: metricsRef } = useIntersectionAnimation('fadeIn', 0.2, '0px');
  const { elementRef: chartsRef } = useIntersectionAnimation('slideInUp', 0.3, '0px');

  // Mock data
  const [analysisData] = useState<AnalysisData>({
    id: '1',
    title: '팀 커뮤니케이션 분석',
    description: '2024년 1월 팀 커뮤니케이션 패턴 분석',
    status: 'completed',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    metrics: {
      totalMessages: 15420,
      activeUsers: 45,
      engagementRate: 78.5,
      responseTime: 2.3,
    },
    charts: {
      messageTrend: [120, 150, 180, 200, 160, 140, 180],
      userActivity: [85, 90, 75, 88, 92, 87, 89],
      channelPerformance: [
        { name: '일반', value: 45 },
        { name: '프로젝트', value: 30 },
        { name: '소셜', value: 15 },
        { name: '공지사항', value: 10 },
      ],
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateAnalysis = () => {
    toast.success('새로운 분석을 시작합니다.');
  };

  const handleExportData = () => {
    toast.success('데이터가 성공적으로 내보내졌습니다.');
  };

  const handleShareAnalysis = () => {
    toast.info('분석 결과를 공유합니다.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'processing':
        return '처리 중';
      case 'failed':
        return '실패';
      default:
        return '알 수 없음';
    }
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  데이터 분석
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  커뮤니케이션 패턴과 사용자 활동을 분석합니다
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === 'dark' ? '🌞' : '🌙'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateAnalysis}
                >
                  새 분석 시작
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
              <TabsTrigger value="metrics" className="flex items-center space-x-2">
                <span>📈</span>
                <span>지표</span>
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center space-x-2">
                <span>📉</span>
                <span>차트</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center space-x-2">
                <span>📋</span>
                <span>보고서</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Analysis Info */}
              <Card variant="modern">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{analysisData.title}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {analysisData.description}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(analysisData.status) as any}>
                      {getStatusText(analysisData.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">생성일:</span>
                      <p className="font-medium">{analysisData.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">업데이트:</span>
                      <p className="font-medium">{analysisData.updatedAt.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">분석 ID:</span>
                      <p className="font-medium">{analysisData.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">상태:</span>
                      <p className="font-medium">{getStatusText(analysisData.status)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <div ref={metricsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassmorphicCard className="p-6 text-center">
                  <div className="text-3xl text-blue-600 mb-2">💬</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analysisData.metrics.totalMessages.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    총 메시지
                  </div>
                  <Badge variant="success" className="text-xs">
                    +12%
                  </Badge>
                </GlassmorphicCard>

                <GlassmorphicCard className="p-6 text-center">
                  <div className="text-3xl text-green-600 mb-2">👥</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analysisData.metrics.activeUsers}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    활성 사용자
                  </div>
                  <Badge variant="success" className="text-xs">
                    +8%
                  </Badge>
                </GlassmorphicCard>

                <GlassmorphicCard className="p-6 text-center">
                  <div className="text-3xl text-purple-600 mb-2">📈</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analysisData.metrics.engagementRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    참여율
                  </div>
                  <Badge variant="success" className="text-xs">
                    +5%
                  </Badge>
                </GlassmorphicCard>

                <GlassmorphicCard className="p-6 text-center">
                  <div className="text-3xl text-orange-600 mb-2">⏱️</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analysisData.metrics.responseTime}h
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    평균 응답시간
                  </div>
                  <Badge variant="warning" className="text-xs">
                    -15%
                  </Badge>
                </GlassmorphicCard>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NeumorphicCard className="p-6 text-center cursor-pointer hover:scale-105 transition-transform">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    상세 분석
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    더 자세한 분석 결과를 확인하세요
                  </p>
                </NeumorphicCard>

                <NeumorphicCard className="p-6 text-center cursor-pointer hover:scale-105 transition-transform">
                  <div className="text-3xl mb-3">📋</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    보고서 생성
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    PDF 보고서를 생성합니다
                  </p>
                </NeumorphicCard>

                <NeumorphicCard className="p-6 text-center cursor-pointer hover:scale-105 transition-transform">
                  <div className="text-3xl mb-3">📤</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    데이터 내보내기
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    분석 데이터를 CSV로 내보냅니다
                  </p>
                </NeumorphicCard>
              </div>
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Message Trend */}
                <Card variant="modern">
                  <CardHeader>
                    <CardTitle>메시지 트렌드</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between space-x-2">
                      {analysisData.charts.messageTrend.map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                          style={{ height: `${(value / 200) * 100}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>월</span>
                      <span>화</span>
                      <span>수</span>
                      <span>목</span>
                      <span>금</span>
                      <span>토</span>
                      <span>일</span>
                    </div>
                  </CardContent>
                </Card>

                {/* User Activity */}
                <Card variant="modern">
                  <CardHeader>
                    <CardTitle>사용자 활동</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between space-x-2">
                      {analysisData.charts.userActivity.map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>월</span>
                      <span>화</span>
                      <span>수</span>
                      <span>목</span>
                      <span>금</span>
                      <span>토</span>
                      <span>일</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Channel Performance */}
              <Card variant="modern">
                <CardHeader>
                  <CardTitle>채널별 성과</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisData.charts.channelPerformance.map((channel, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                          <span className="font-medium">{channel.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${channel.value}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                            {channel.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Charts Tab */}
            <TabsContent value="charts" className="space-y-6">
              <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Interactive Chart Placeholder */}
                <Card variant="modern">
                  <CardHeader>
                    <CardTitle>실시간 메시지 분석</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-4">📊</div>
                        <p className="text-gray-600 dark:text-gray-400">
                          인터랙티브 차트가 여기에 표시됩니다
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Heatmap Placeholder */}
                <Card variant="modern">
                  <CardHeader>
                    <CardTitle>활동 히트맵</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-4">🔥</div>
                        <p className="text-gray-600 dark:text-gray-400">
                          활동 히트맵이 여기에 표시됩니다
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card variant="modern">
                <CardHeader>
                  <CardTitle>분석 보고서</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          월간 분석 보고서
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          2024년 1월 커뮤니케이션 분석
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleShareAnalysis}>
                          공유
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleExportData}>
                          다운로드
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          주간 요약 보고서
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          2024년 1월 2주차 요약
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleShareAnalysis}>
                          공유
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleExportData}>
                          다운로드
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Floating Action Buttons */}
        <FloatingActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
          label="새 분석"
          variant="primary"
          size="lg"
          position="bottom-right"
          onClick={handleCreateAnalysis}
        />

        <FloatingActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          label="내보내기"
          variant="secondary"
          size="md"
          position="bottom-left"
          onClick={handleExportData}
        />
      </div>
    </AuthGuard>
  );
};

export default ModernAnalysisPage; 