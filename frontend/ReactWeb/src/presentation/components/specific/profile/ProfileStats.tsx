import React from 'react';
import { cn } from '../../../../utils/cn';
import type { ProfileStatsProps } from '../../../pages/profile/types/profileTypes';

const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      <div className="text-center p-4 bg-surface border border-border rounded-lg">
        <div className="text-2xl font-bold text-primary">{stats.totalFriends}</div>
        <div className="text-sm text-txt-secondary">친구</div>
      </div>
      
      <div className="text-center p-4 bg-surface border border-border rounded-lg">
        <div className="text-2xl font-bold text-primary">{stats.totalPosts}</div>
        <div className="text-sm text-txt-secondary">게시물</div>
      </div>
      
      <div className="text-center p-4 bg-surface border border-border rounded-lg">
        <div className="text-2xl font-bold text-primary">{stats.totalLikes}</div>
        <div className="text-sm text-txt-secondary">좋아요</div>
      </div>
      
      <div className="text-center p-4 bg-surface border border-border rounded-lg">
        <div className="text-lg font-bold text-primary">{stats.memberSince}</div>
        <div className="text-sm text-txt-secondary">가입일</div>
      </div>
    </div>
  );
};

export default ProfileStats; 