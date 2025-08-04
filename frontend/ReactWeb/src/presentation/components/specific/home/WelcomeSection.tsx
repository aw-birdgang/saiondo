import React from 'react';
import { TouchFriendlyButton } from '../../common';
import { cn } from '../../../../utils/cn';

interface WelcomeSectionProps {
  greeting: string;
  userName: string;
  onNewProject?: () => void;
  onGetStarted?: () => void;
  className?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  greeting,
  userName,
  onNewProject,
  onGetStarted,
  className
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-txt animate-fade-in">
          {greeting}, {userName}님! 👋
        </h1>
        <p className="text-txt-secondary animate-fade-in" style={{ animationDelay: '0.2s' }}>
          오늘도 Saiondo와 함께 즐거운 하루를 보내세요
        </p>
      </div>
      <div className="hidden md:flex items-center space-x-3">
        <TouchFriendlyButton
          variant="outline"
          size="sm"
          onClick={onNewProject}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          새 프로젝트
        </TouchFriendlyButton>
        <TouchFriendlyButton
          variant="gradient"
          size="sm"
          onClick={onGetStarted}
          pulse
          haptic
        >
          시작하기
        </TouchFriendlyButton>
      </div>
    </div>
  );
};

export default WelcomeSection; 