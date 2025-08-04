import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAuthStore} from '../../../stores/authStore';
import {useUserStore} from '../../../stores/userStore';
import {useChannelStore} from '../../../stores/channelStore';
import {useDataLoader} from "../../hooks/useDataLoader";
import {useToastContext} from "../../providers/ToastProvider";
import {
  ActivityListSection,
  ChartsSection,
  HomeContainer,
  HomeLoadingState,
  QuickActionsSection,
  StatsGrid,
  SystemStatusSection,
  WelcomeSection
} from "../../components/specific/home";
import {useHomeData} from "./hooks/useHomeData";


const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { loading, fetchCurrentUser } = useUserStore();
  const { channels, fetchChannelsByUserId } = useChannelStore();
  const [greeting, setGreeting] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toast = useToastContext();

  // 커스텀 훅으로 데이터 관리
  const {
    chartData,
    barData,
    statsData,
    quickActions,
    activities,
    systemStatus,
    notifications,
    isLoading: dataLoading,
    refreshData
  } = useHomeData();

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

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 임시로 데이터 로딩을 비활성화하여 무한 로딩 문제 해결
  const { loadData: loadHomeData } = useDataLoader(
    async () => {
      console.log('HomePage data loading disabled temporarily');
    },
    [user?.id, fetchCurrentUser, fetchChannelsByUserId],
    { autoLoad: false }
  );

  // Event handlers
  const handleNewProject = () => {
    toast.info('새 프로젝트 기능이 곧 출시됩니다!');
  };

  const handleGetStarted = () => {
    toast.info('새로운 기능이 곧 출시됩니다!');
  };

  const handleQuickAction = (action: any) => {
    toast.success(`${action.title}으로 이동합니다!`);
    // 실제로는 라우터를 사용하여 이동
  };

  const handleSwipeDelete = (index: number) => {
    toast.success(`항목 ${index + 1}이 삭제되었습니다!`);
  };

  const handleSwipeEdit = (index: number) => {
    toast.info(`항목 ${index + 1}을 편집합니다!`);
  };

  const handleChartPointClick = (point: any, index: number) => {
    toast.info(`${point.label}: ${point.y}점`);
  };

  if (loading || dataLoading) {
    return <HomeLoadingState />;
  }

  return (
    <HomeContainer isVisible={isVisible}>
      <WelcomeSection
        greeting={greeting}
        userName={user?.name || '사용자'}
        onNewProject={handleNewProject}
        onGetStarted={handleGetStarted}
      />

      <StatsGrid stats={statsData} />

      <ChartsSection
        lineChartData={chartData}
        barChartData={barData}
        onChartPointClick={handleChartPointClick}
      />

      <QuickActionsSection
        actions={quickActions}
        onActionClick={handleQuickAction}
      />

      <ActivityListSection
        activities={activities}
        onDelete={handleSwipeDelete}
        onEdit={handleSwipeEdit}
      />

      <SystemStatusSection
        systemStatus={systemStatus}
        notifications={notifications}
      />
    </HomeContainer>
  );
};

export default HomePage;
