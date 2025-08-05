export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  PENDING = 'PENDING',
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: '활성',
  [UserStatus.INACTIVE]: '비활성',
  [UserStatus.SUSPENDED]: '정지',
  [UserStatus.BANNED]: '차단',
  [UserStatus.PENDING]: '대기',
};
