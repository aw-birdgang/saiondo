import React from 'react';
import { Button } from '../../common';
import { cn } from '../../../../utils/cn';
import type { ProfileHeaderProps } from '../../../pages/profile/types/profileTypes';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isSaving,
  className
}) => {
  return (
    <div className={cn("flex items-center justify-between p-4 bg-surface border-b border-border", className)}>
      <div>
        <h1 className="text-2xl font-bold text-txt">프로필</h1>
        <p className="text-sm text-txt-secondary">
          {isEditing ? '프로필을 편집하세요' : '프로필 정보를 확인하세요'}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={onSave}
              disabled={isSaving}
              loading={isSaving}
              loadingText="저장 중..."
            >
              저장
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            onClick={onEdit}
          >
            편집
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader; 