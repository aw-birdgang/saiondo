import type { UserProfile } from '../types/profileTypes';

// Mock 사용자 프로필 데이터
export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user123',
  name: '김철수',
  email: 'kim@example.com',
  profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  bio: '안녕하세요! 저는 개발자 김철수입니다. 새로운 기술을 배우는 것을 좋아하고, 사람들과 소통하는 것을 즐깁니다.',
  location: '서울, 대한민국',
  birthDate: '1990-05-15',
  gender: 'male',
  phone: '+82-10-1234-5678',
  website: 'https://kimdev.com',
  socialLinks: {
    instagram: 'https://instagram.com/kimdev',
    twitter: 'https://twitter.com/kimdev',
    facebook: 'https://facebook.com/kimdev',
    linkedin: 'https://linkedin.com/in/kimdev'
  },
  preferences: {
    theme: 'system',
    language: 'ko',
    timezone: 'Asia/Seoul',
    notifications: true
  },
  stats: {
    totalFriends: 156,
    totalPosts: 89,
    totalLikes: 1247,
    memberSince: '2023년 3월'
  },
  isVerified: true,
  isOnline: true,
  lastSeen: '방금 전',
  createdAt: new Date('2023-03-15'),
  updatedAt: new Date()
};

// 성별 옵션
export const GENDER_OPTIONS = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
  { value: 'other', label: '기타' },
  { value: 'prefer-not-to-say', label: '선택하지 않음' }
];

// 테마 옵션
export const THEME_OPTIONS = [
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
  { value: 'system', label: '시스템' }
];

// 언어 옵션
export const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' }
];

// 시간대 옵션
export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Seoul', label: '서울 (UTC+9)' },
  { value: 'Asia/Tokyo', label: '도쿄 (UTC+9)' },
  { value: 'America/New_York', label: '뉴욕 (UTC-5)' },
  { value: 'Europe/London', label: '런던 (UTC+0)' },
  { value: 'Asia/Shanghai', label: '상하이 (UTC+8)' }
];

// 소셜 미디어 플랫폼
export const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/username' },
  { key: 'twitter', label: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/username' },
  { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/username' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/username' }
];

// 프로필 완성도 기준
export const PROFILE_COMPLETION_CRITERIA = [
  { field: 'name', weight: 20, label: '이름' },
  { field: 'email', weight: 15, label: '이메일' },
  { field: 'bio', weight: 15, label: '자기소개' },
  { field: 'location', weight: 10, label: '위치' },
  { field: 'birthDate', weight: 10, label: '생년월일' },
  { field: 'phone', weight: 10, label: '전화번호' },
  { field: 'website', weight: 10, label: '웹사이트' },
  { field: 'profileUrl', weight: 10, label: '프로필 사진' }
];

// 프로필 저장 시뮬레이션 시간 (ms)
export const PROFILE_SAVE_TIME = 1500;

// 프로필 로딩 시뮬레이션 시간 (ms)
export const PROFILE_LOAD_TIME = 800;

// 아바타 크기 설정
export const AVATAR_SIZES = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
}; 