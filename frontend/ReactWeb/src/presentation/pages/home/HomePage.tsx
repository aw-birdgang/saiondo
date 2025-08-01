import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useAuthStore} from '../../../stores/authStore';
import {useUserStore} from '../../../stores/userStore';
import {useChannelStore} from '../../../stores/channelStore';
import {Header} from "../../components/common";
import {PageWrapper} from "../../components/layout";
import {HomeContent} from "../../components/specific";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { loading, fetchCurrentUser } = useUserStore();
  const { channels, fetchChannelsByUserId } = useChannelStore();

  // Load current user and channels on component mount
  useEffect(() => {
    if (user?.id) {
      fetchCurrentUser();
      fetchChannelsByUserId(user.id);
    }
  }, [user?.id, fetchCurrentUser, fetchChannelsByUserId]);

  return (
    <PageWrapper background="gradient">
      {/* Header */}
      <Header
        title={t("app.name")}
        showLogout
        showThemeToggle
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HomeContent
          loading={loading}
          channels={channels || {}}
        />
      </div>
    </PageWrapper>
  );
};

export default HomePage;
