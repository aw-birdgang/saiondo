import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ROUTES } from "../../constants";

const InvitePartnerScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("SAIONDO123");
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success(t("invite.codeCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("코드 복사에 실패했습니다.");
    }
  };

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
                {t("invite.invitePartner")}
              </h1>
              <p className="text-sm text-gray-500">
                파트너를 초대하여 함께 사용해보세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">💕</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              파트너 초대하기
            </h2>
            <p className="text-gray-600">
              초대 코드를 파트너에게 공유하여 함께 Saiondo를 사용해보세요.
            </p>
          </div>

          {/* Invite Code */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("invite.inviteCode")}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3">
                <span className="text-xl font-mono font-bold text-gray-900">
                  {inviteCode}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-primary text-white hover:bg-primaryContainer"
                }`}
              >
                {copied ? "복사됨" : t("invite.copyCode")}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              초대 방법
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-gray-700">
                  위의 초대 코드를 복사합니다.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-gray-700">
                  파트너에게 초대 코드를 전달합니다.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-gray-700">
                  파트너가 앱에서 초대 코드를 입력하면 연결됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePartnerScreen;
