import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../constants";

interface AnalysisData {
  channelId: string;
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
  averageResponseTime: number;
  sentiment: "positive" | "neutral" | "negative";
  topics: string[];
  insights: string[];
}

const AnalysisScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const channelId = searchParams.get("channelId") || "default-channel";

  // Mock analysis data
  const [analysisData] = React.useState<AnalysisData>({
    channelId,
    totalMessages: 156,
    userMessages: 78,
    assistantMessages: 78,
    averageResponseTime: 2.3,
    sentiment: "positive",
    topics: ["관계 개선", "소통", "감정 표현", "일상 대화"],
    insights: [
      "대화에서 긍정적인 감정이 많이 나타납니다.",
      "서로에 대한 관심과 이해가 깊어지고 있습니다.",
      "감정 표현이 점차 자연스러워지고 있습니다.",
      "일상적인 대화가 증가하여 관계가 더 친밀해졌습니다.",
    ],
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-100";
      case "negative":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "긍정적";
      case "negative":
        return "부정적";
      default:
        return "중립적";
    }
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
            <h1 className="text-lg font-semibold text-text">대화 분석</h1>
          </div>
          <div className="text-sm text-text-secondary">채널: {channelId}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {analysisData.totalMessages}
                </div>
                <div className="text-text-secondary">총 메시지</div>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {analysisData.userMessages}
                </div>
                <div className="text-text-secondary">사용자 메시지</div>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {analysisData.assistantMessages}
                </div>
                <div className="text-text-secondary">어시스턴트 메시지</div>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {analysisData.averageResponseTime}s
                </div>
                <div className="text-text-secondary">평균 응답 시간</div>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-text">감정 분석</h2>
            </div>
            <div className="card-body">
              <div className="flex items-center space-x-4">
                <span className="text-text-secondary">전체 감정:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysisData.sentiment)}`}
                >
                  {getSentimentText(analysisData.sentiment)}
                </span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      analysisData.sentiment === "positive"
                        ? "bg-green-500"
                        : analysisData.sentiment === "negative"
                          ? "bg-red-500"
                          : "bg-gray-500"
                    }`}
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-text">주요 토픽</h2>
            </div>
            <div className="card-body">
              <div className="flex flex-wrap gap-2">
                {analysisData.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary text-on-primary rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-text">인사이트</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {analysisData.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-text">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-text">추천사항</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">
                    잘하고 있는 점
                  </h3>
                  <p className="text-green-700">
                    서로에 대한 관심과 이해가 깊어지고 있어요. 계속해서 이런
                    긍정적인 소통을 유지해보세요.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    개선할 점
                  </h3>
                  <p className="text-blue-700">
                    더 구체적인 감정 표현과 함께 상대방의 감정에 공감하는 표현을
                    늘려보세요.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">
                    다음 단계
                  </h3>
                  <p className="text-purple-700">
                    함께 새로운 활동이나 취미를 찾아보는 것도 좋은 방법입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.CHAT)}
              className="btn btn-primary"
            >
              채팅으로 돌아가기
            </button>
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

export default AnalysisScreen;
