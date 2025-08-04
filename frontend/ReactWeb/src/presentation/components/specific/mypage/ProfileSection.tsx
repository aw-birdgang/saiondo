import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, UserProfile } from '../../common';
import { cn } from '../../../../utils/cn';
import type { ProfileSectionProps } from '../../../pages/mypage/types/mypageTypes';

const ProfileSection: React.FC<ProfileSectionProps> = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  className
}) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>내 프로필</CardTitle>
            <CardDescription>프로필 정보를 관리하세요</CardDescription>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={onSave}>
                  저장
                </Button>
                <Button variant="outline" size="sm" onClick={onCancel}>
                  취소
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={onEdit}>
                편집
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserProfile
          showEditButton={false}
          showMemberSince
          size="lg"
        />
      </CardContent>
    </Card>
  );
};

export default ProfileSection; 