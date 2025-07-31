import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

const HomeTab: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStartAIChat = () => {
    navigate(ROUTES.CHAT);
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="max-w-md w-full">
            {/* Main Card */}
            <div className="bg-gradient-to-br from-blue-100 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 rounded-3xl shadow-lg p-8">
              {/* AI Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl">🤖</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300 mb-4">
                {t('ai_advice_bot')}
              </h2>

              {/* Description */}
              <p className="text-center text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                {t('ai_advice_description')}
              </p>

              {/* Start Chat Button */}
              <button
                onClick={handleStartAIChat}
                className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                <span className="mr-3">💬</span>
                {t('start_ai_advice_chat')}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate(ROUTES.ANALYSIS)}
                className="bg-white dark:bg-dark-secondary-container p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <span className="text-2xl mb-2 block">📊</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('analysis')}
                  </span>
                </div>
              </button>

              <button
                onClick={() => navigate(ROUTES.CHANNEL)}
                className="bg-white dark:bg-dark-secondary-container p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <span className="text-2xl mb-2 block">👥</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('channel')}
                  </span>
                </div>
              </button>
            </div>

            {/* Welcome Message */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('welcome_message')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTab; 