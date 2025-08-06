import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/stores/userStore';
import {useToastContext} from '@/presentation/providers/ToastProvider';
import {AIChatWidget} from '@/presentation/components/chat/AIChatWidget';
import {AuthGuard} from '@/presentation/components/auth';
import {
  AIInfoWidget,
  DashboardHeader,
  HomeContainer,
  HomeLoadingState,
  QuickActionsSection,
  SearchSection,
} from '@/presentation/components/home';
import {useHomeData} from '@/presentation/pages/home/hooks/useHomeData';
import {FloatingActionButton} from '@/presentation/components/common/FloatingActionButton';

const HomePage: React.FC = () => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  // const { user } = useAuthStore();
  const { loading } = useUserStore();
  // const { fetchChannelsByUserId } = useChannelStore();
  const [isVisible, setIsVisible] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const toast = useToastContext();

  // 커스텀 훅으로 데이터 관리
  const {
    quickActions,
    isLoading: dataLoading,
    // refreshData,
  } = useHomeData();

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
          '시간 관리',
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
    <AuthGuard requireAuth={true}>
      <HomeContainer isVisible={isVisible}>
        <DashboardHeader />

        <SearchSection
          onSearch={handleSearch}
          onSuggestionClick={handleSuggestionClick}
          suggestions={searchSuggestions}
        />

        <QuickActionsSection
          actions={quickActions}
          onActionClick={handleQuickAction}
        />
      </HomeContainer>

      {/* AI 채팅 위젯 */}
      <AIChatWidget />

      {/* AI 기능 안내 */}
      <AIInfoWidget />

    </AuthGuard>
  );
};

export default HomePage;
