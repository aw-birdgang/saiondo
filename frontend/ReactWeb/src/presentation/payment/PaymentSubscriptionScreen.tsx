import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: "monthly" | "yearly";
  features: string[];
  popular?: boolean;
}

const PaymentSubscriptionScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const plans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "무료",
      price: 0,
      period: "monthly",
      features: ["기본 채팅 기능", "일일 대화 분석", "기본 알림", "1개 채널"],
    },
    {
      id: "premium",
      name: "프리미엄",
      price: 9900,
      period: "monthly",
      features: [
        "무제한 채팅",
        "실시간 대화 분석",
        "고급 AI 조언",
        "무제한 채널",
        "우선 지원",
        "고급 알림 설정",
      ],
      popular: true,
    },
    {
      id: "premium-yearly",
      name: "프리미엄 (연간)",
      price: 99000,
      period: "yearly",
      features: [
        "무제한 채팅",
        "실시간 대화 분석",
        "고급 AI 조언",
        "무제한 채널",
        "우선 지원",
        "고급 알림 설정",
        "2개월 무료",
      ],
    },
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      // Simulate payment process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock success
      alert("구독이 성공적으로 완료되었습니다!");
      navigate(ROUTES.HOME);
    } catch {
      alert("구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "무료";
    return `₩${price.toLocaleString()}`;
  };

  const formatPeriod = (period: string) => {
    return period === "monthly" ? "월" : "년";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="text-text-secondary hover:text-text"
            >
              ← 뒤로
            </button>
            <h1 className="text-lg font-semibold text-text">구독 관리</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text mb-4">
              Saiondo 프리미엄으로 업그레이드
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              더 나은 관계를 위한 고급 기능들을 경험해보세요. AI 기반 개인화된
              조언과 실시간 분석으로 더 깊은 소통을 만들어보세요.
            </p>
          </div>

          {/* Current Plan */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-semibold text-text">현재 구독</h3>
            </div>
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-text">무료 플랜</h4>
                  <p className="text-text-secondary">
                    기본 기능을 사용 중입니다
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  활성
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div>
            <h3 className="text-2xl font-bold text-text mb-6 text-center">
              구독 플랜 선택
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`card relative ${
                    plan.popular ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-sm font-medium">
                        인기
                      </span>
                    </div>
                  )}

                  <div className="card-body">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-semibold text-text mb-2">
                        {plan.name}
                      </h4>
                      <div className="mb-2">
                        <span className="text-3xl font-bold text-primary">
                          {formatPrice(plan.price)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-text-secondary">
                            /{formatPeriod(plan.period)}
                          </span>
                        )}
                      </div>
                      {plan.period === "yearly" && plan.price > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          월 ₩{Math.round(plan.price / 12).toLocaleString()}{" "}
                          (연간 결제 시)
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-text">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={handleSubscribe}
                      disabled={isLoading || plan.id === "free"}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                        plan.id === "free"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : plan.popular
                            ? "bg-primary text-on-primary hover:bg-primaryContainer"
                            : "bg-secondary text-on-secondary hover:bg-secondary-container"
                      }`}
                    >
                      {isLoading
                        ? "처리 중..."
                        : plan.id === "free"
                          ? "현재 플랜"
                          : "구독하기"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Comparison */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-semibold text-text">기능 비교</h3>
            </div>
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-text">
                        기능
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-text">
                        무료
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-text">
                        프리미엄
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-text">일일 메시지 수</td>
                      <td className="text-center py-3 px-4 text-text-secondary">
                        50개
                      </td>
                      <td className="text-center py-3 px-4 text-primary font-medium">
                        무제한
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-text">대화 분석</td>
                      <td className="text-center py-3 px-4 text-text-secondary">
                        일일 1회
                      </td>
                      <td className="text-center py-3 px-4 text-primary font-medium">
                        실시간
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-text">AI 조언</td>
                      <td className="text-center py-3 px-4 text-text-secondary">
                        기본
                      </td>
                      <td className="text-center py-3 px-4 text-primary font-medium">
                        고급
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-text">채널 수</td>
                      <td className="text-center py-3 px-4 text-text-secondary">
                        1개
                      </td>
                      <td className="text-center py-3 px-4 text-primary font-medium">
                        무제한
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-text">고객 지원</td>
                      <td className="text-center py-3 px-4 text-text-secondary">
                        이메일
                      </td>
                      <td className="text-center py-3 px-4 text-primary font-medium">
                        우선 지원
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-semibold text-text">
                자주 묻는 질문
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-text mb-2">
                    언제든지 구독을 취소할 수 있나요?
                  </h4>
                  <p className="text-text-secondary">
                    네, 언제든지 구독을 취소할 수 있습니다. 취소 후에는 다음
                    결제일까지 프리미엄 기능을 계속 사용할 수 있습니다.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-text mb-2">
                    연간 구독과 월간 구독의 차이점은?
                  </h4>
                  <p className="text-text-secondary">
                    연간 구독은 월간 구독보다 2개월 무료로 제공됩니다. 장기간
                    사용하실 계획이라면 연간 구독이 더 경제적입니다.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-text mb-2">
                    환불 정책은 어떻게 되나요?
                  </h4>
                  <p className="text-text-secondary">
                    구독 후 7일 이내에 환불 요청을 하시면 전액 환불해드립니다.
                    7일 이후에는 부분 환불이 불가능합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="btn btn-secondary"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSubscriptionScreen;
