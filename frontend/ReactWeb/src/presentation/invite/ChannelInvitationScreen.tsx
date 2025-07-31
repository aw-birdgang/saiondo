import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

const ChannelInvitationScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-xl">←</span>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                채널 초대
              </h1>
              <p className="text-sm text-gray-500">
                채널 초대를 관리하세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 text-2xl">📧</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              채널 초대가 없습니다
            </h3>
            <p className="text-gray-500">
              새로운 채널 초대가 오면 여기에 표시됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelInvitationScreen;
