import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '../../common';
import { cn } from '../../../../utils/cn';
import type { AccountManagementProps } from '../../../pages/mypage/types/mypageTypes';

const AccountManagement: React.FC<AccountManagementProps> = ({
  onLogout,
  onSettings,
  isLoading,
  className
}) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>계정 관리</CardTitle>
        <CardDescription>계정 관련 설정을 관리하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onSettings}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            설정
          </Button>
          <Button
            variant="destructive"
            fullWidth
            onClick={onLogout}
            disabled={isLoading}
            loading={isLoading}
            loadingText="로그아웃 중..."
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            }
          >
            로그아웃
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountManagement; 