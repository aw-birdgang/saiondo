import type { SettingsOption } from '@/presentation/components/specific/mypage/components/SettingsCard';

export const SETTINGS_OPTIONS: SettingsOption[] = [
  {
    id: 'profile',
    title: '프로필 설정',
    description: '개인 정보 및 프로필 관리',
    icon: '👤',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/10',
  },
  {
    id: 'security',
    title: '보안 설정',
    description: '비밀번호 및 2단계 인증',
    icon: '🔒',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/10',
  },
  {
    id: 'notifications',
    title: '알림 설정',
    description: '앱 알림 및 이메일 설정',
    icon: '🔔',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/10',
  },
  {
    id: 'privacy',
    title: '개인정보 보호',
    description: '데이터 사용 및 개인정보 설정',
    icon: '🛡️',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/10',
  },
];
