import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../stores/userStore';
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
  Avatar,
  Skeleton,
  GlassmorphicCard,
  NeumorphicCard,
  FloatingActionButton
} from '../../components/common';
import { useIntersectionAnimation, useStaggerAnimation } from '../../../shared/design-system/animations';
import { useTheme } from '../../../shared/design-system/hooks';

const ModernHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { loading } = useUserStore();
  const toast = useToastContext();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Animation hooks
  const { elementRef: heroRef } = useIntersectionAnimation('slideInUp', 0.1, '0px');
  const { elementRef: statsRef } = useIntersectionAnimation('fadeIn', 0.2, '0px');
  const { elementRef: featuresRef } = useIntersectionAnimation('slideInUp', 0.3, '0px');

  // Stagger animation for cards
  const cards = [
    { id: 1, title: 'AI 어시스턴트', description: '개인화된 AI 상담 서비스' },
    { id: 2, title: '커뮤니티', description: '다양한 주제의 토론 공간' },
    { id: 3, title: '학습 자료', description: '체계적인 학습 콘텐츠' },
    { id: 4, title: '진로 상담', description: '전문가의 진로 가이드' },
  ];
  const animatedCards = useStaggerAnimation(cards, 'fadeIn', 100);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCardClick = (cardId: number) => {
    toast.success(`${cards.find(c => c.id === cardId)?.title} 페이지로 이동합니다!`);
    // 실제 라우팅 로직 추가
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
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
        <header className="relative z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar
                  src="/logo.png"
                  fallback="S"
                  size="lg"
                  className="ring-2 ring-primary/20"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Saiondo
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI 기반 개인화 플랫폼
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === 'dark' ? '🌞' : '🌙'}
                </Button>
                <Avatar
                  src="/avatar.jpg"
                  fallback="U"
                  size="md"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section ref={heroRef} className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                🚀 새로운 기능 출시
              </Badge>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                AI와 함께하는
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  {' '}스마트한 삶
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                개인화된 AI 어시스턴트와 함께 더 나은 결정을 내리고, 
                목표를 달성하세요.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="무엇을 도와드릴까요?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 text-lg pr-32"
                    variant="modern"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="absolute right-2 top-2 h-10"
                  >
                    검색
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassmorphicCard className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-gray-600 dark:text-gray-300">활성 사용자</div>
              </GlassmorphicCard>
              
              <GlassmorphicCard className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-gray-600 dark:text-gray-300">완료된 상담</div>
              </GlassmorphicCard>
              
              <GlassmorphicCard className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">99%</div>
                <div className="text-gray-600 dark:text-gray-300">만족도</div>
              </GlassmorphicCard>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                주요 기능
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                다양한 AI 기반 서비스로 더 나은 경험을 제공합니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card, index) => (
                <NeumorphicCard
                  key={card.id}
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    animatedCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  onClick={() => handleCardClick(card.id)}
                  hover={true}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {card.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {card.description}
                    </p>
                  </div>
                </NeumorphicCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card variant="modern" className="p-12 text-center">
              <CardHeader>
                <CardTitle className="text-3xl mb-4">
                  지금 시작해보세요
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  AI 어시스턴트와 함께 더 나은 내일을 만들어가세요
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="primary">
                    무료로 시작하기
                  </Button>
                  <Button size="lg" variant="outline">
                    데모 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Floating Action Button */}
        <FloatingActionButton
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          }
          label="AI 채팅 시작"
          variant="primary"
          size="lg"
          position="bottom-right"
          onClick={() => {
            toast.success('AI 채팅을 시작합니다!');
            navigate('/ai-chat');
          }}
        />
      </div>
    </AuthGuard>
  );
};

export default ModernHomePage; 