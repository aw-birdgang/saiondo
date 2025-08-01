import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-hot-toast";
import {AnalysisContent, AnalysisHeader, AnalysisLayout, ErrorState, LoadingState} from "../../components/specific";

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

const AnalysisPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();


  // Analysis state
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    data: null,
    isLoading: false,
    isCreating: false,
    error: null,
  });

  // Extract channelId from URL or location state
  const channelId = params.channelId || location.state?.channelId;

  // Channel ID is already available from URL params

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
    return <LoadingState />;
  }

  if (!analysisState.data) {
    return (
      <ErrorState
        title={t("analysis_load_fail")}
        message="분석 데이터를 불러올 수 없습니다."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <AnalysisLayout>
      {/* Header */}
      <AnalysisHeader
        onCreateAnalysis={handleCreateAnalysis}
        isCreating={analysisState.isCreating}
      />

      {/* Content */}
      <AnalysisContent data={analysisState.data} />
    </AnalysisLayout>
  );
};

export default AnalysisPage;
