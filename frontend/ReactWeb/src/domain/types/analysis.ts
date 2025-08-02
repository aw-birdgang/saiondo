export interface AnalysisData {
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

export interface AnalysisState {
  data: AnalysisData | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
} 