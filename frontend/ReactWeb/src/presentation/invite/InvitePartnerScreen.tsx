import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ROUTES } from "../../constants";

interface InviteFormData {
  partnerEmail: string;
  message: string;
}

const InvitePartnerScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>();

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock invite code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setInviteCode(code);

      toast.success("파트너 초대가 성공적으로 전송되었습니다!");
    } catch {
      toast.error("초대 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateInviteCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(code);
    toast.success("새로운 초대 코드가 생성되었습니다!");
  };

  const copyInviteCode = async () => {
    if (inviteCode) {
      try {
        await navigator.clipboard.writeText(inviteCode);
        toast.success("초대 코드가 클립보드에 복사되었습니다!");
      } catch {
        toast.error("클립보드 복사에 실패했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="text-text-secondary hover:text-text"
            >
              ← 뒤로
            </button>
            <h1 className="text-lg font-semibold text-text">파트너 초대</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Invite by Email */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-text">
                이메일로 초대하기
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="partnerEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    파트너 이메일
                  </label>
                  <input
                    {...register("partnerEmail", {
                      required: "파트너의 이메일을 입력해주세요.",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "유효한 이메일 주소를 입력해주세요.",
                      },
                    })}
                    type="email"
                    id="partnerEmail"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.partnerEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="partner@example.com"
                  />
                  {errors.partnerEmail && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.partnerEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    초대 메시지 (선택사항)
                  </label>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="파트너에게 전할 메시지를 입력하세요..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primaryContainer"
                  }`}
                >
                  {isLoading ? "초대 전송 중..." : "초대 전송하기"}
                </button>
              </form>
            </div>
          </div>

          {/* Invite Code */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-text">
                초대 코드로 초대하기
              </h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <p className="text-text-secondary">
                  초대 코드를 생성하여 파트너와 공유하세요. 파트너가 이 코드를
                  입력하면 함께 사용할 수 있습니다.
                </p>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      초대 코드
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={inviteCode}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg text-center"
                        placeholder="초대 코드를 생성하세요"
                      />
                      <button
                        onClick={copyInviteCode}
                        disabled={!inviteCode}
                        className="btn btn-secondary px-4"
                      >
                        복사
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateInviteCode}
                  className="w-full btn btn-outline"
                >
                  새로운 초대 코드 생성
                </button>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-text">
                초대 방법 안내
              </h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-text">초대 전송</h3>
                    <p className="text-sm text-text-secondary">
                      파트너의 이메일 주소를 입력하거나 초대 코드를 생성합니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-text">파트너 초대 수락</h3>
                    <p className="text-sm text-text-secondary">
                      파트너가 이메일 링크를 클릭하거나 초대 코드를 입력합니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-text">함께 사용 시작</h3>
                    <p className="text-sm text-text-secondary">
                      파트너와 함께 Saiondo를 사용하여 관계를 개선해보세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Invites */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-text">
                대기 중인 초대
              </h2>
            </div>
            <div className="card-body">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-lg font-medium text-text mb-2">
                  대기 중인 초대가 없습니다
                </h3>
                <p className="text-text-secondary">
                  파트너가 초대를 수락하면 여기에 표시됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="btn btn-secondary"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvitePartnerScreen;
