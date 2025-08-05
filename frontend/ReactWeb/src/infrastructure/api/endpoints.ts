export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',

  // Users
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_ASSISTANTS: (id: string) => `/users/${id}/assistants`,
  USER_FCM_TOKEN: (id: string) => `/users/${id}/fcm-token`,
  USER_ME: '/users/me',

  // Persona Profiles
  PERSONA_PROFILES: (userId: string) => `/persona-profiles/user/${userId}`,
  CREATE_PERSONA_PROFILE: (userId: string) =>
    `/persona-profiles/user/${userId}`,
  UPDATE_PERSONA_PROFILE: (userId: string, categoryCodeId: string) =>
    `/persona-profiles/user/${userId}/category/${categoryCodeId}`,
  DELETE_PERSONA_PROFILE: (userId: string, categoryCodeId: string) =>
    `/persona-profiles/user/${userId}/category/${categoryCodeId}`,

  // Channels
  CHANNELS: '/channels',
  CHANNEL_BY_ID: (id: string) => `/channels/${id}`,
  CHANNEL_BY_USER_ID: (userId: string) => `/channels/by-user/${userId}`,
  INVITE_CODE: (id: string) => `/channels/${id}/inviteCode`,
  ACCEPT: (id: string) => `/channels/${id}/accept`,
  REJECT: (id: string) => `/channels/${id}/reject`,
  MEMBERS: (channelId: string) => `/channels/${channelId}/members`,
  MEMBER_BY_ID: (channelId: string, userId: string) =>
    `/channels/${channelId}/members/${userId}`,
  CLEANUP: '/channels/cleanup',
  DELETE_CHANNEL: (id: string) => `/channels/${id}`,
  JOIN_BY_INVITE: '/channels/join-by-invite',
  LEAVE_CHANNEL: '/channels/leave',
  INVITATIONS_FOR_USER: (userId: string) => `/users/${userId}/invitations`,
  RESPOND_INVITATION: (invitationId: string) =>
    `/invitations/${invitationId}/respond`,
  INVITE: (channelId: string) => `/channels/${channelId}/invite`,
  HAS_PENDING_INVITATION: (channelId: string, inviteeId: string) =>
    `/channels/${channelId}/invitations/pending/${inviteeId}`,

  // Assistants
  ASSISTANTS: '/assistants',
  ASSISTANT_BY_ID: (assistantId: string) => `/assistants/${assistantId}`,
  ASSISTANTS_BY_USER: (userId: string) => `/assistants/user/${userId}`,

  // Events
  EVENTS: '/events',
  EVENT_BY_ID: (id: string) => `/events/${id}`,
  EVENT_BY_USER_ID: (userId: string) => `/events/user/${userId}`,

  // Points
  POINT_EARN: (userId: string) => `/point/${userId}/earn`,
  POINT_USE: (userId: string) => `/point/${userId}/use`,
  POINT_ADJUST: (userId: string) => `/point/${userId}/adjust`,
  POINT_HISTORY: (userId: string) => `/point/${userId}/history`,

  // Couple Analysis
  COUPLE_ANALYSIS_BY_CHANNEL_ID: (channelId: string) =>
    `/couple-analysis/${channelId}`,
  COUPLE_ANALYSIS_BY_CHANNEL_ID_LATEST: (channelId: string) =>
    `/couple-analysis/${channelId}/latest`,
  COUPLE_ANALYSIS_LLM: (channelId: string) =>
    `/couple-analysis/${channelId}/llm`,

  // Advice
  ADVICE_HISTORIES: (channelId: string) => `/advice/channel/${channelId}`,
  ADVICE_HISTORY_LATEST: (channelId: string) =>
    `/advice/channel/${channelId}/latest`,

  // Chat
  CHAT_HISTORY: (channelId: string, userId: string) =>
    `/chat/${channelId}/${userId}/history`,
  SEND_MESSAGE: (channelId: string, userId: string) =>
    `/chat/${channelId}/${userId}/message`,
  CHAT_LIST: '/chat/list?pageRows=10&pageNumber=1&languageType=EN',
  CHAT: '/chat',
  CHAT_HISTORIES: (assistantId: string) => `/chat/${assistantId}/histories`,

  // Category Codes
  CATEGORY_CODES: '/category-codes',

  // Payment Subscription
  PAYMENT_SUBSCRIPTION: '/payment_subscription',
  PAYMENT_SUBSCRIPTION_CURRENT: '/payment-subscription/current',
  PAYMENT_SUBSCRIPTION_VERIFY: '/payment-subscription/verify',
  PAYMENT_SUBSCRIPTION_SAVE: '/payment-subscription/save',
  PAYMENT_SUBSCRIPTION_HISTORIES:
    '/payment-subscription/subscription-histories',
  PAYMENT_SUBSCRIPTION_HISTORIES_BY_USER: (userId: string) =>
    `/payment-subscription/${userId}/subscription-histories`,
} as const;
