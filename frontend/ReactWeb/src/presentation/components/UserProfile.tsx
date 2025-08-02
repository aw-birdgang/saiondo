import React from "react";
import { useUserStore } from "../../stores/userStore";

export const UserProfile: React.FC = () => {
  const { currentUser, loading, error } = useUserStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-error rounded-full flex items-center justify-center">
              <span className="text-on-error text-xs">!</span>
            </div>
            <p className="text-error font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-text-secondary rounded-full flex items-center justify-center">
              <span className="text-surface text-xs">?</span>
            </div>
            <p className="text-txt-secondary font-medium">No user data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl text-on-primary font-bold">
              {currentUser.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-txt">
              {currentUser.name || 'Unknown User'}
            </h2>
            <p className="text-txt-secondary">{currentUser.email}</p>
            {currentUser.createdAt && (
              <p className="text-sm text-txt-secondary">
                Member since: {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card-body space-y-6">
        {currentUser.bio && (
          <div>
            <h3 className="text-lg font-semibold text-txt mb-3">Bio</h3>
            <p className="text-txt-secondary leading-relaxed">{currentUser.bio}</p>
          </div>
        )}

        {currentUser.preferences && (
          <div>
            <h3 className="text-lg font-semibold text-txt mb-3">Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-txt-secondary font-medium">Notifications</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentUser.preferences.notifications 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {currentUser.preferences.notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-txt-secondary font-medium">Email Notifications</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentUser.preferences.emailNotifications 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {currentUser.preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-txt-secondary font-medium">Language</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {currentUser.preferences.language}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-divider pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-secondary rounded-lg">
              <span className="text-txt-secondary block mb-1">User ID:</span>
              <p className="text-txt font-mono font-medium">{currentUser.id}</p>
            </div>
            {currentUser.updatedAt && (
              <div className="p-3 bg-secondary rounded-lg">
                <span className="text-txt-secondary block mb-1">Last Updated:</span>
                <p className="text-txt font-medium">
                  {new Date(currentUser.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
