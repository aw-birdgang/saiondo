export interface AnalysisUser {
  name: string;
  profileUrl?: string;
  mbti?: string;
}

export interface AnalysisData {
  user1: AnalysisUser;
  user2: AnalysisUser;
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

export interface AnalysisHeaderProps {
  onCreateAnalysis: () => void;
  isCreating: boolean;
  className?: string;
}

export interface AnalysisContentProps {
  data: AnalysisData;
  className?: string;
}

export interface AnalysisLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface AnalysisChartData {
  label: string;
  value: number;
  color: string;
}

export interface CoupleProfileProps {
  user1: AnalysisUser;
  user2: AnalysisUser;
  className?: string;
}

export interface MbtiMatchProps {
  user1: AnalysisUser;
  user2: AnalysisUser;
  matchPercent?: string;
  className?: string;
}

export interface KeywordsSectionProps {
  keywords: string[];
  className?: string;
}

export interface AnalysisSectionProps {
  summary?: string;
  advice?: string;
  className?: string;
}

export interface PersonasSectionProps {
  persona1?: string;
  persona2?: string;
  className?: string;
}

export interface AnalysisChartProps {
  title: string;
  data: AnalysisChartData[];
  type: 'bar' | 'line' | 'pie';
  maxValue?: number;
  className?: string;
} 