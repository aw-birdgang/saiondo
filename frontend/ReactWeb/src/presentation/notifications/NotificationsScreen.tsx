import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "message" | "analysis" | "invite" | "system";
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

const NotificationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "새로운 메시지",
      message: "AI 어시스턴트가 새로운 메시지를 보냈습니다.",
      type: "message",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5분 전
      isRead: false,
      actionUrl: ROUTES.CHAT,
    },
    {
      id: "2",
      title: "대화 분석 완료",
      message: "오늘의 대화 분석이 완료되었습니다. 결과를 확인해보세요.",
      type: "analysis",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
      isRead: false,
      actionUrl: ROUTES.ANALYSIS,
    },
    {
      id: "3",
      title: "파트너 초대",
      message: "파트너가 새로운 채널에 초대했습니다.",
      type: "invite",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
      isRead: true,
      actionUrl: ROUTES.CHANNEL_INVITATIONS,
    },
    {
      id: "4",
      title: "시스템 업데이트",
      message: "새로운 기능이 추가되었습니다. 확인해보세요!",
      type: "system",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
      isRead: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return "💬";
      case "analysis":
        return "📊";
      case "invite":
        return "👥";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "message":
        return "bg-blue-100 text-blue-800";
      case "analysis":
        return "bg-green-100 text-green-800";
      case "invite":
        return "bg-purple-100 text-purple-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
            <h1 className="text-lg font-semibold text-text">알림</h1>
            {unreadCount > 0 && (
              <span className="bg-primary text-on-primary px-2 py-1 rounded-full text-xs font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary hover:text-primaryContainer"
            >
              모두 읽음 처리
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-semibold text-text mb-2">
              알림이 없습니다
            </h2>
            <p className="text-text-secondary">
              새로운 알림이 오면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`card transition-all duration-200 ${
                  !notification.isRead ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="card-body">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getNotificationColor(notification.type)}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-lg font-semibold ${!notification.isRead ? "text-text" : "text-text-secondary"}`}
                        >
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-text-secondary">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <p className="text-text-secondary mt-1">
                        {notification.message}
                      </p>

                      <div className="flex items-center space-x-2 mt-3">
                        {notification.actionUrl && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id);
                              navigate(notification.actionUrl!);
                            }}
                            className="text-sm text-primary hover:text-primaryContainer font-medium"
                          >
                            확인하기
                          </button>
                        )}

                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-text-secondary hover:text-text"
                        >
                          읽음 처리
                        </button>

                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Settings */}
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-text">알림 설정</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text">새 메시지 알림</h3>
                    <p className="text-sm text-text-secondary">
                      AI 어시스턴트의 새 메시지를 받습니다
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text">분석 완료 알림</h3>
                    <p className="text-sm text-text-secondary">
                      대화 분석이 완료되면 알림을 받습니다
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text">초대 알림</h3>
                    <p className="text-sm text-text-secondary">
                      새로운 채널 초대를 받습니다
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-text">시스템 알림</h3>
                    <p className="text-sm text-text-secondary">
                      앱 업데이트 및 시스템 메시지를 받습니다
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsScreen;
