import type { LoginFormData, RegisterFormData } from '../types/authTypes';

// 테스트용 기본 로그인 데이터
export const DEFAULT_LOGIN_DATA: LoginFormData = {
  email: 'kim@example.com',
  password: 'password123'
};

// 테스트용 기본 회원가입 데이터
export const DEFAULT_REGISTER_DATA: RegisterFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  gender: ''
};

// 빠른 로그인 테스트 계정들
export const QUICK_LOGIN_ACCOUNTS = [
  {
    email: 'user1@example.com',
    label: '테스트 계정 1',
    description: '일반 사용자'
  },
  {
    email: 'user2@example.com',
    label: '테스트 계정 2',
    description: '관리자'
  },
  {
    email: 'user3@example.com',
    label: '테스트 계정 3',
    description: '프리미엄 사용자'
  }
];

// 성별 옵션
export const GENDER_OPTIONS = [
  { value: '', label: '성별 선택' },
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
  { value: 'other', label: '기타' }
];

// 이메일 검증 정규식
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 비밀번호 최소 길이
export const PASSWORD_MIN_LENGTH = 6;

// 이름 최소 길이
export const NAME_MIN_LENGTH = 2; 