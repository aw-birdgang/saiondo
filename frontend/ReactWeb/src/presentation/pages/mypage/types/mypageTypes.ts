export interface ActivityStat {
  label: string;
  value: string;
  trend: string;
  color: string;
}

export interface RecentActivity {
  id: number;
  action: string;
  time: string;
  type: 'chat' | 'ai' | 'channel' | 'analysis';
}

export interface QuickAction {
  id: string;
  title: string;
  path: string;
  icon: string;
  description?: string;
}

export interface AccountProgressItem {
  id: string;
  label: string;
  completed: boolean;
  color: 'green' | 'yellow' | 'red';
}

export interface MyPageState {
  isLoading: boolean;
  isEditing: boolean;
  profileCompletion: number;
}

export interface ProfileSectionProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
}

export interface ActivityStatsProps {
  stats: ActivityStat[];
  className?: string;
}

export interface RecentActivitiesProps {
  activities: RecentActivity[];
  className?: string;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
  className?: string;
}

export interface AccountProgressProps {
  progress: number;
  items: AccountProgressItem[];
  className?: string;
}

export interface AccountManagementProps {
  onLogout: () => void;
  onSettings: () => void;
  isLoading: boolean;
  className?: string;
} 