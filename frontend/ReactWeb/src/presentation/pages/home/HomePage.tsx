import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from '../../../stores/authStore';
import {useUserStore} from '../../../stores/userStore';
import {useChannelStore} from '../../../stores/channelStore';
import {useDataLoader} from "../../hooks/useDataLoader";
import {useToastContext} from "../../providers/ToastProvider";
import {SearchInput} from "../../components/search";
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
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { loading, fetchCurrentUser } = useUserStore();
  const { channels, fetchChannelsByUserId } = useChannelStore();
  const [greeting, setGreeting] = useState('');
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
    <HomeContainer isVisible={isVisible}>
      <WelcomeSection
        greeting={greeting}
        userName={user?.name || '사용자'}
        onNewProject={handleNewProject}
        onGetStarted={handleGetStarted}
      />

      {/* 검색 섹션 추가 */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-txt mb-2">무엇을 찾고 계신가요?</h2>
            <p className="text-txt-secondary">상담, 조언, 정보를 검색해보세요</p>
          </div>
          <SearchInput
            placeholder="상담 주제나 키워드를 입력하세요..."
            className="w-full"
            onSearch={handleSearch}
            showSuggestions={true}
            suggestions={searchSuggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </div>

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
