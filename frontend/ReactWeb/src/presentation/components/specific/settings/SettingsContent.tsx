import React from 'react';
import { cn } from '../../../../utils/cn';
import SettingsSection from './SettingsSection';
import ToggleSetting from './ToggleSetting';
import SelectSetting from './SelectSetting';
import {
  THEME_OPTIONS,
  LANGUAGE_OPTIONS,
  FONT_SIZE_OPTIONS,
  COLOR_BLINDNESS_OPTIONS,
  PROFILE_VISIBILITY_OPTIONS,
  TIME_OPTIONS
} from '../../../pages/settings/constants/settingsData';
import type { SettingsContentProps } from '../../../pages/settings/types/settingsTypes';

const SettingsContent: React.FC<SettingsContentProps> = ({
  activeSection,
  settings,
  onSettingChange,
  className
}) => {
  if (!settings) {
    return (
      <div className={cn("flex-1 p-6", className)}>
        <p className="text-txt-secondary text-center">설정을 불러오는 중...</p>
      </div>
    );
  }

  const renderGeneralSettings = () => (
    <SettingsSection title="일반 설정" description="기본 앱 설정을 관리하세요">
      <SelectSetting
        title="테마"
        description="앱의 테마를 선택하세요"
        value={settings.theme}
        options={THEME_OPTIONS}
        onChange={(value) => onSettingChange('theme', value)}
      />
      <SelectSetting
        title="언어"
        description="앱 언어를 선택하세요"
        value={settings.language}
        options={LANGUAGE_OPTIONS}
        onChange={(value) => onSettingChange('language', value)}
      />
    </SettingsSection>
  );

  const renderNotificationSettings = () => (
    <SettingsSection title="알림 설정" description="알림 관련 설정을 관리하세요">
      <ToggleSetting
        title="푸시 알림"
        description="푸시 알림을 받습니다"
        value={settings.notifications.pushEnabled}
        onChange={(value) => onSettingChange('notifications.pushEnabled', value)}
      />
      <ToggleSetting
        title="이메일 알림"
        description="이메일로 알림을 받습니다"
        value={settings.notifications.emailEnabled}
        onChange={(value) => onSettingChange('notifications.emailEnabled', value)}
      />
      <ToggleSetting
        title="채팅 알림"
        description="채팅 메시지 알림을 받습니다"
        value={settings.notifications.chatNotifications}
        onChange={(value) => onSettingChange('notifications.chatNotifications', value)}
      />
      <ToggleSetting
        title="채널 알림"
        description="채널 활동 알림을 받습니다"
        value={settings.notifications.channelNotifications}
        onChange={(value) => onSettingChange('notifications.channelNotifications', value)}
      />
      <ToggleSetting
        title="분석 알림"
        description="관계 분석 결과 알림을 받습니다"
        value={settings.notifications.analysisNotifications}
        onChange={(value) => onSettingChange('notifications.analysisNotifications', value)}
      />
      <ToggleSetting
        title="마케팅 알림"
        description="마케팅 관련 알림을 받습니다"
        value={settings.notifications.marketingNotifications}
        onChange={(value) => onSettingChange('notifications.marketingNotifications', value)}
      />
      <ToggleSetting
        title="조용한 시간"
        description="특정 시간에 알림을 받지 않습니다"
        value={settings.notifications.quietHours.enabled}
        onChange={(value) => onSettingChange('notifications.quietHours.enabled', value)}
      />
    </SettingsSection>
  );

  const renderPrivacySettings = () => (
    <SettingsSection title="개인정보 설정" description="개인정보 보호 설정을 관리하세요">
      <SelectSetting
        title="프로필 가시성"
        description="프로필을 누구에게 보여줄지 설정하세요"
        value={settings.privacy.profileVisibility}
        options={PROFILE_VISIBILITY_OPTIONS}
        onChange={(value) => onSettingChange('privacy.profileVisibility', value)}
      />
      <ToggleSetting
        title="온라인 상태 표시"
        description="다른 사용자에게 온라인 상태를 보여줍니다"
        value={settings.privacy.showOnlineStatus}
        onChange={(value) => onSettingChange('privacy.showOnlineStatus', value)}
      />
      <ToggleSetting
        title="친구 요청 허용"
        description="다른 사용자의 친구 요청을 받습니다"
        value={settings.privacy.allowFriendRequests}
        onChange={(value) => onSettingChange('privacy.allowFriendRequests', value)}
      />
      <ToggleSetting
        title="메시지 허용"
        description="다른 사용자의 메시지를 받습니다"
        value={settings.privacy.allowMessages}
        onChange={(value) => onSettingChange('privacy.allowMessages', value)}
      />
      <ToggleSetting
        title="데이터 공유"
        description="익명화된 데이터를 공유합니다"
        value={settings.privacy.dataSharing}
        onChange={(value) => onSettingChange('privacy.dataSharing', value)}
      />
      <ToggleSetting
        title="분석 데이터 수집"
        description="앱 사용 분석 데이터를 수집합니다"
        value={settings.privacy.analyticsEnabled}
        onChange={(value) => onSettingChange('privacy.analyticsEnabled', value)}
      />
    </SettingsSection>
  );

  const renderAccessibilitySettings = () => (
    <SettingsSection title="접근성 설정" description="접근성 관련 설정을 관리하세요">
      <SelectSetting
        title="폰트 크기"
        description="텍스트 크기를 조정하세요"
        value={settings.accessibility.fontSize}
        options={FONT_SIZE_OPTIONS}
        onChange={(value) => onSettingChange('accessibility.fontSize', value)}
      />
      <ToggleSetting
        title="고대비 모드"
        description="고대비 색상으로 표시합니다"
        value={settings.accessibility.highContrast}
        onChange={(value) => onSettingChange('accessibility.highContrast', value)}
      />
      <ToggleSetting
        title="모션 감소"
        description="애니메이션을 줄입니다"
        value={settings.accessibility.reduceMotion}
        onChange={(value) => onSettingChange('accessibility.reduceMotion', value)}
      />
      <ToggleSetting
        title="스크린 리더"
        description="스크린 리더 지원을 활성화합니다"
        value={settings.accessibility.screenReader}
        onChange={(value) => onSettingChange('accessibility.screenReader', value)}
      />
      <SelectSetting
        title="색맹 지원"
        description="색맹 사용자를 위한 색상 조정"
        value={settings.accessibility.colorBlindness}
        options={COLOR_BLINDNESS_OPTIONS}
        onChange={(value) => onSettingChange('accessibility.colorBlindness', value)}
      />
    </SettingsSection>
  );

  const renderDisplaySettings = () => (
    <SettingsSection title="표시 설정" description="화면 표시 관련 설정을 관리하세요">
      <ToggleSetting
        title="컴팩트 모드"
        description="더 조밀한 레이아웃을 사용합니다"
        value={settings.display.compactMode}
        onChange={(value) => onSettingChange('display.compactMode', value)}
      />
      <ToggleSetting
        title="아바타 표시"
        description="사용자 아바타를 표시합니다"
        value={settings.display.showAvatars}
        onChange={(value) => onSettingChange('display.showAvatars', value)}
      />
      <ToggleSetting
        title="타임스탬프 표시"
        description="메시지 시간을 표시합니다"
        value={settings.display.showTimestamps}
        onChange={(value) => onSettingChange('display.showTimestamps', value)}
      />
      <ToggleSetting
        title="자동 재생"
        description="동영상을 자동으로 재생합니다"
        value={settings.display.autoPlayVideos}
        onChange={(value) => onSettingChange('display.autoPlayVideos', value)}
      />
      <ToggleSetting
        title="읽음 표시"
        description="메시지 읽음 상태를 표시합니다"
        value={settings.display.showReadReceipts}
        onChange={(value) => onSettingChange('display.showReadReceipts', value)}
      />
    </SettingsSection>
  );

  const renderAccountSettings = () => (
    <SettingsSection title="계정 설정" description="계정 관련 설정을 관리하세요">
      <div className="p-4 border border-border rounded-lg">
        <h3 className="font-medium text-txt">계정 정보</h3>
        <p className="text-sm text-txt-secondary mt-1">
          계정 정보는 별도 페이지에서 관리할 수 있습니다.
        </p>
        <button className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
          계정 관리로 이동
        </button>
      </div>
    </SettingsSection>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'accessibility':
        return renderAccessibilitySettings();
      case 'display':
        return renderDisplaySettings();
      case 'account':
        return renderAccountSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className={cn("flex-1 p-6 overflow-y-auto", className)}>
      {renderSection()}
    </div>
  );
};

export default SettingsContent; 