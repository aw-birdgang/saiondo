import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../../core/stores/authStore";

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Saiondo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-text-secondary">
                안녕하세요, {user?.name || "사용자"}님!
              </span>
              <button onClick={handleLogout} className="btn btn-outline">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text mb-4">
            홈 화면에 오신 것을 환영합니다!
          </h2>
          <p className="text-text-secondary text-lg">
            Saiondo 앱의 메인 기능들을 사용해보세요.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chat Card */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-text mb-2">채팅</h3>
              <p className="text-text-secondary mb-4">
                AI 어시스턴트와 실시간으로 대화하세요.
              </p>
              <button
                onClick={() => navigate(ROUTES.CHAT)}
                className="btn btn-primary w-full"
              >
                채팅 시작하기
              </button>
            </div>
          </div>

          {/* Analysis Card */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-text mb-2">
                대화 분석
              </h3>
              <p className="text-text-secondary mb-4">
                대화 내용을 분석하고 인사이트를 얻어보세요.
              </p>
              <button
                onClick={() => navigate(ROUTES.ANALYSIS)}
                className="btn btn-primary w-full"
              >
                분석 보기
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-text mb-2">알림</h3>
              <p className="text-text-secondary mb-4">
                새로운 메시지와 업데이트를 확인하세요.
              </p>
              <button
                onClick={() => navigate(ROUTES.NOTIFICATIONS)}
                className="btn btn-primary w-full"
              >
                알림 확인
              </button>
            </div>
          </div>

          {/* Invite Partner Card */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-text mb-2">
                파트너 초대
              </h3>
              <p className="text-text-secondary mb-4">
                파트너를 초대하여 함께 사용해보세요.
              </p>
              <button
                onClick={() => navigate(ROUTES.INVITE_PARTNER)}
                className="btn btn-primary w-full"
              >
                파트너 초대
              </button>
            </div>
          </div>

          {/* Channel Invitations Card */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-text mb-2">
                채널 초대
              </h3>
              <p className="text-text-secondary mb-4">
                채널 초대를 관리하고 참여하세요.
              </p>
              <button
                onClick={() => navigate(ROUTES.CHANNEL_INVITATIONS)}
                className="btn btn-primary w-full"
              >
                채널 관리
              </button>
            </div>
          </div>

          {/* Payment Subscription Card */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-text mb-2">
                구독 관리
              </h3>
              <p className="text-text-secondary mb-4">
                프리미엄 기능을 구독하고 관리하세요.
              </p>
              <button
                onClick={() => navigate(ROUTES.PAYMENT_SUBSCRIPTION)}
                className="btn btn-primary w-full"
              >
                구독 관리
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-text mb-6">최근 활동</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-primary mb-2">12</div>
                <div className="text-text-secondary">오늘의 메시지</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <div className="text-text-secondary">활성 채널</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <div className="text-text-secondary">새로운 알림</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
