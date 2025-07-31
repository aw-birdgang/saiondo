import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ROUTES } from "../../constants";
import { useUserStore } from "../../core/stores/userStore";

interface AnalysisData {
  user1: {
    name: string;
    profileUrl?: string;
    mbti?: string;
  };
  user2: {
    name: string;
    profileUrl?: string;
    mbti?: string;
  };
  matchPercent?: string;
  keywords: string[];
  summary?: string;
  advice?: string;
  persona1?: string;
  persona2?: string;
}

interface AnalysisState {
  data: AnalysisData | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

const AnalysisScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { setChannelId } = useUserStore();

  // Analysis state
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    data: null,
    isLoading: false,
    isCreating: false,
    error: null,
  });

  // Extract channelId from URL or location state
  const channelId = params.channelId || location.state?.channelId;

  // Update store with URL parameter
  useEffect(() => {
    if (channelId) {
      setChannelId(channelId);
    }
  }, [channelId, setChannelId]);

  // Load analysis data
  useEffect(() => {
    const loadAnalysis = async () => {
      if (!channelId) return;

      setAnalysisState(prev => ({ ...prev, isLoading: true }));
      try {
        // TODO: Implement actual API call
        const mockData: AnalysisData = {
          user1: {
            name: "김철수",
            mbti: "ENFP",
          },
          user2: {
            name: "이영희",
            mbti: "ISTJ",
          },
          matchPercent: "85",
          keywords: ["신뢰", "소통", "성장", "지지", "이해"],
          summary: "두 사람은 서로를 잘 이해하고 지지하는 관계입니다. 서로의 차이점을 인정하고 함께 성장해 나가는 모습이 인상적입니다.",
          advice: "정기적인 대화 시간을 가지며 서로의 감정을 공유하는 것이 좋겠습니다.",
          persona1: "열정적이고 창의적인 성격으로 새로운 경험을 추구합니다.",
          persona2: "안정적이고 체계적인 성격으로 계획을 세우고 실행하는 것을 좋아합니다.",
        };

        setTimeout(() => {
          setAnalysisState(prev => ({ 
            ...prev, 
            data: mockData, 
            isLoading: false 
          }));
        }, 1000);
      } catch (error) {
        console.error("Failed to load analysis:", error);
        setAnalysisState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: t("analysis_load_fail") 
        }));
        toast.error(t("analysis_load_fail"));
      }
    };

    loadAnalysis();
  }, [channelId, t]);

  // Error handling
  useEffect(() => {
    if (analysisState.error) {
      toast.error(analysisState.error);
      setAnalysisState(prev => ({ ...prev, error: null }));
    }
  }, [analysisState.error]);

  const handleCreateAnalysis = async () => {
    if (!channelId) return;

    setAnalysisState(prev => ({ ...prev, isCreating: true }));
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("새로운 분석이 생성되었습니다!");
      
      // Reload analysis data
      const mockData: AnalysisData = {
        user1: {
          name: "김철수",
          mbti: "ENFP",
        },
        user2: {
          name: "이영희",
          mbti: "ISTJ",
        },
        matchPercent: "90",
        keywords: ["신뢰", "소통", "성장", "지지", "이해", "사랑"],
        summary: "새로운 분석 결과, 두 사람의 관계가 더욱 깊어졌습니다. 서로를 더 잘 이해하고 지지하는 모습이 보입니다.",
        advice: "정기적인 데이트와 함께 새로운 활동을 시도해보세요.",
        persona1: "열정적이고 창의적인 성격으로 새로운 경험을 추구합니다.",
        persona2: "안정적이고 체계적인 성격으로 계획을 세우고 실행하는 것을 좋아합니다.",
      };

      setAnalysisState(prev => ({ 
        ...prev, 
        data: mockData, 
        isCreating: false 
      }));
    } catch (error) {
      console.error("Failed to create analysis:", error);
      setAnalysisState(prev => ({ 
        ...prev, 
        isCreating: false 
      }));
      toast.error("분석 생성에 실패했습니다.");
    }
  };

  if (analysisState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!analysisState.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("analysis_load_fail")}
            </h3>
            <p className="text-gray-500 mb-4">
              분석 데이터를 불러올 수 없습니다.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primaryContainer transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="text-xl">←</span>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("analysis.title")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  관계 분석 결과를 확인하세요
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateAnalysis}
              disabled={analysisState.isCreating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                analysisState.isCreating
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primaryContainer"
              }`}
            >
              {analysisState.isCreating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>분석 중...</span>
                </div>
              ) : (
                "새 분석 생성"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Couple Profile */}
          <div className="bg-gradient-to-r from-pink-100 to-blue-50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {analysisState.data.user1.name.charAt(0)}
                </span>
              </div>
              <div className="text-3xl text-pink-400">❤️</div>
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {analysisState.data.user2.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-pink-600">
                {analysisState.data.user1.name} ❤️ {analysisState.data.user2.name}
              </h2>
            </div>
          </div>

          {/* MBTI Match */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("couple_mbti_match")}
            </h3>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full font-medium">
                {analysisState.data.user1.mbti}
              </span>
              <span className="text-pink-500">↔️</span>
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full font-medium">
                {analysisState.data.user2.mbti}
              </span>
              {analysisState.data.matchPercent && (
                <span className="text-pink-600 font-bold">
                  {analysisState.data.matchPercent}% {t("good_match")}
                </span>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("main_keywords")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysisState.data.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("analysis_summary")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {analysisState.data.summary}
            </p>
          </div>

          {/* Advice */}
          {analysisState.data.advice && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("advice")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {analysisState.data.advice}
              </p>
            </div>
          )}

          {/* Personas */}
          {(analysisState.data.persona1 || analysisState.data.persona2) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                성향 분석
              </h3>
              {analysisState.data.persona1 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {t("user1_persona")}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {analysisState.data.persona1}
                  </p>
                </div>
              )}
              {analysisState.data.persona2 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {t("user2_persona")}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {analysisState.data.persona2}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisScreen;
