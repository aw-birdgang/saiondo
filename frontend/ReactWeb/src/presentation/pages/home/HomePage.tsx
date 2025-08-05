import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from '../../../stores/authStore';
import {useUserStore} from '../../../stores/userStore';
import {useChannelStore} from '../../../stores/channelStore';
import {useDataLoader} from "../../hooks/useDataLoader";
import {useToastContext} from "../../providers/ToastProvider";
import {SearchInput} from "../../components/search";
import {AIChatWidget} from "../../components/chat/AIChatWidget";
import {
  ActivityListSection,
  ChartsSection,
  HomeContainer,
  HomeLoadingState,
  QuickActionsSection,
  StatsGrid,
  SystemStatusSection,
  DashboardHeader,
  SearchSection,
  AIInfoWidget
} from "../../components/specific/home";
import {useHomeData} from "./hooks/useHomeData";


const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { loading, fetchCurrentUser } = useUserStore();
  const { channels, fetchChannelsByUserId } = useChannelStore();
  const [isVisible, setIsVisible] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
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

  // 검색 제안 로드
  useEffect(() => {
    const loadSearchSuggestions = async () => {
      try {
        // 실제 API 호출 대신 임시 데이터 사용
        const suggestions = [
          '관계 상담',
          '직장 스트레스',
          '가족 문제',
          '자기계발',
          '취미 활동',
          '건강 관리',
          '재정 관리',
          '시간 관리'
        ];
        setSearchSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to load search suggestions:', error);
      }
    };

    loadSearchSuggestions();
  }, []);

  const handleQuickAction = (action: any) => {
    if (action.title === 'AI 어시스턴트 선택') {
      toast.success('AI 어시스턴트 선택 페이지로 이동합니다!');
      navigate('/assistant');
    } else if (action.title === '프로필 관리') {
      toast.success('프로필 페이지로 이동합니다!');
      navigate('/profile/me');
    } else {
      toast.success(`${action.title}으로 이동합니다!`);
      // 다른 액션들에 대한 라우팅 처리
      if (action.href) {
        navigate(action.href);
      }
    }
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

  // 검색 처리
  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  if (loading || dataLoading) {
    return <HomeLoadingState />;
  }

  return (
    <>
      <HomeContainer isVisible={isVisible}>
        <DashboardHeader />

        <SearchSection
          onSearch={handleSearch}
          onSuggestionClick={handleSuggestionClick}
          suggestions={searchSuggestions}
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

      {/* AI 채팅 위젯 */}
      <AIChatWidget />
      
      {/* AI 기능 안내 */}
      <AIInfoWidget />
    </>
  );
};

export default HomePage;
