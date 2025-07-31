import React from "react";
import { useUserStore } from "../../stores/userStore";

export const UserProfile: React.FC = () => {
  const { currentUser, loading, error } = useUserStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">No user data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-2xl text-white font-bold">
            {currentUser.name?.charAt(0) || 'U'}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {currentUser.name || 'Unknown User'}
          </h2>
          <p className="text-gray-600">{currentUser.email}</p>
          {currentUser.createdAt && (
            <p className="text-sm text-gray-500">
              Member since: {new Date(currentUser.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {currentUser.bio && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
          <p className="text-gray-700">{currentUser.bio}</p>
        </div>
      )}

      {currentUser.preferences && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Notifications</span>
              <span className={`px-2 py-1 rounded text-sm ${
                currentUser.preferences.notifications 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {currentUser.preferences.notifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <span className={`px-2 py-1 rounded text-sm ${
                currentUser.preferences.emailNotifications 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {currentUser.preferences.emailNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Language</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {currentUser.preferences.language}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">User ID:</span>
            <p className="text-gray-900 font-mono">{currentUser.id}</p>
          </div>
          {currentUser.updatedAt && (
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <p className="text-gray-900">
                {new Date(currentUser.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
