import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";

interface PushMessageData {
  userId?: string;
  channelId?: string;
  assistantId?: string;
  [key: string]: any;
}

export const usePushNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setChannelId, setAssistantId } = useUserStore();

  const handlePushNavigation = (data: PushMessageData) => {
    const { userId, channelId, assistantId } = data;

    // Null check
    if (!userId || !channelId || !assistantId) {
      console.error("[usePushNavigation] Error: Missing required parameters");
      console.log("userId:", userId, "channelId:", channelId, "assistantId:", assistantId);
      return;
    }

    console.log("[usePushNavigation] Attempting navigation with:");
    console.log("userId:", userId, "channelId:", channelId, "assistantId:", assistantId);

    // Update store
    setChannelId(channelId);
    setAssistantId(assistantId);

    // Navigate to chat screen
    navigate(`${ROUTES.CHAT}/${channelId}/${assistantId}`, {
      state: { channelId, assistantId },
    });
  };

  // Listen for push notifications when app is in foreground
  useEffect(() => {
    if (!isAuthenticated) return;

    // TODO: Set up Firebase messaging listener
    // This would be implemented when Firebase is properly configured
    const handleMessage = (payload: any) => {
      console.log("[usePushNavigation] Received push message:", payload);
      if (payload.data) {
        handlePushNavigation(payload.data);
      }
    };

    // Mock implementation for now
    // In real implementation, this would be:
    // const unsubscribe = onMessage(handleMessage);
    // return unsubscribe;
  }, [isAuthenticated, navigate, setChannelId, setAssistantId]);

  return { handlePushNavigation };
}; 