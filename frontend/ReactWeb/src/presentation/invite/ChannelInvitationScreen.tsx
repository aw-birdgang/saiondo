import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

interface ChannelInvitation {
  id: string;
  channelName: string;
  inviterName: string;
  inviterEmail: string;
  message: string;
  timestamp: Date;
  status: "pending" | "accepted" | "declined";
}

const ChannelInvitationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<ChannelInvitation[]>([
    {
      id: "1",
      channelName: "우리만의 공간",
      inviterName: "김철수",
      inviterEmail: "kim@example.com",
      message: "함께 대화하고 관계를 개선해보아요!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
      status: "pending",
    },
    {
      id: "2",
      channelName: "커플 대화방",
      inviterName: "이영희",
      inviterEmail: "lee@example.com",
      message: "새로운 채널에 초대합니다.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
      status: "accepted",
    },
    {
      id: "3",
      channelName: "일상 공유",
      inviterName: "박민수",
      inviterEmail: "park@example.com",
      message: "일상적인 대화를 나누는 공간입니다.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
      status: "declined",
    },
  ]);

  const handleAcceptInvitation = (id: string) => {
    setInvitations((prev) =>
      prev.map((invitation) =>
        invitation.id === id
          ? { ...invitation, status: "accepted" }
          : invitation,
      ),
    );
  };

  const handleDeclineInvitation = (id: string) => {
    setInvitations((prev) =>
      prev.map((invitation) =>
        invitation.id === id
          ? { ...invitation, status: "declined" }
          : invitation,
      ),
    );
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "대기 중";
      case "accepted":
        return "수락됨";
      case "declined":
        return "거절됨";
      default:
        return "알 수 없음";
    }
  };

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending",
  );
  const otherInvitations = invitations.filter(
    (inv) => inv.status !== "pending",
  );

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
            <h1 className="text-lg font-semibold text-text">채널 초대</h1>
            {pendingInvitations.length > 0 && (
              <span className="bg-primary text-on-primary px-2 py-1 rounded-full text-xs font-medium">
                {pendingInvitations.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">
                대기 중인 초대
              </h2>
              <div className="space-y-4">
                {pendingInvitations.map((invitation) => (
                  <div key={invitation.id} className="card">
                    <div className="card-body">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-text">
                              {invitation.channelName}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}
                            >
                              {getStatusText(invitation.status)}
                            </span>
                          </div>

                          <p className="text-text-secondary mb-2">
                            초대자: {invitation.inviterName} (
                            {invitation.inviterEmail})
                          </p>

                          {invitation.message && (
                            <p className="text-text-secondary mb-4">
                              "{invitation.message}"
                            </p>
                          )}

                          <p className="text-sm text-text-secondary">
                            {formatTimeAgo(invitation.timestamp)}
                          </p>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() =>
                              handleAcceptInvitation(invitation.id)
                            }
                            className="btn btn-primary px-6"
                          >
                            수락
                          </button>
                          <button
                            onClick={() =>
                              handleDeclineInvitation(invitation.id)
                            }
                            className="btn btn-outline px-6"
                          >
                            거절
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Invitations */}
          {otherInvitations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">
                기타 초대
              </h2>
              <div className="space-y-4">
                {otherInvitations.map((invitation) => (
                  <div key={invitation.id} className="card">
                    <div className="card-body">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-text">
                              {invitation.channelName}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}
                            >
                              {getStatusText(invitation.status)}
                            </span>
                          </div>

                          <p className="text-text-secondary mb-2">
                            초대자: {invitation.inviterName} (
                            {invitation.inviterEmail})
                          </p>

                          {invitation.message && (
                            <p className="text-text-secondary mb-4">
                              "{invitation.message}"
                            </p>
                          )}

                          <p className="text-sm text-text-secondary">
                            {formatTimeAgo(invitation.timestamp)}
                          </p>
                        </div>

                        {invitation.status === "accepted" && (
                          <button
                            onClick={() => navigate(ROUTES.CHAT)}
                            className="btn btn-primary px-6"
                          >
                            채팅 참여
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {invitations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📧</div>
              <h2 className="text-2xl font-semibold text-text mb-2">
                채널 초대가 없습니다
              </h2>
              <p className="text-text-secondary mb-6">
                새로운 채널 초대가 오면 여기에 표시됩니다.
              </p>
              <button
                onClick={() => navigate(ROUTES.INVITE_PARTNER)}
                className="btn btn-primary"
              >
                파트너 초대하기
              </button>
            </div>
          )}

          {/* Invite Code Input */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-text">
                초대 코드로 참여하기
              </h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <p className="text-text-secondary">
                  파트너로부터 받은 초대 코드를 입력하여 채널에 참여하세요.
                </p>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="초대 코드를 입력하세요"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-center"
                  />
                  <button className="btn btn-primary px-6">참여</button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.INVITE_PARTNER)}
              className="btn btn-primary"
            >
              파트너 초대하기
            </button>
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

export default ChannelInvitationScreen;
