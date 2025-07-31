// API Endpoints - Flutter Endpoints를 기반으로 생성
export class Endpoints {
  private static baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.saiondo.com' 
    : 'http://localhost:3000';

  // Auth endpoints
  static readonly authRegister = `${Endpoints.baseUrl}/auth/register`;
  static readonly authLogin = `${Endpoints.baseUrl}/auth/login`;

  // User endpoints
  static readonly users = `${Endpoints.baseUrl}/users`;
  static userById = (id: string) => `${Endpoints.baseUrl}/users/${id}`;
  static userAssistants = (id: string) => `${Endpoints.baseUrl}/users/${id}/assistants`;
  static userFcmToken = (id: string) => `${Endpoints.baseUrl}/users/${id}/fcm-token`;

  // Persona profiles
  static personaProfiles = (userId: string) => `${Endpoints.baseUrl}/persona-profiles/user/${userId}`;
  static createPersonaProfile = (userId: string) => `${Endpoints.baseUrl}/persona-profiles/user/${userId}`;
  static updatePersonaProfile = (userId: string, categoryCodeId: string) => 
    `${Endpoints.baseUrl}/persona-profiles/user/${userId}/category/${categoryCodeId}`;
  static deletePersonaProfile = (userId: string, categoryCodeId: string) => 
    `${Endpoints.baseUrl}/persona-profiles/user/${userId}/category/${categoryCodeId}`;

  // Channel endpoints
  static readonly channels = `${Endpoints.baseUrl}/channels`;
  static channelById = (id: string) => `${Endpoints.baseUrl}/channels/${id}`;
  static channelByUserId = (userId: string) => `${Endpoints.baseUrl}/channels/by-user/${userId}`;
  static inviteCode = (id: string) => `${Endpoints.baseUrl}/channels/${id}/inviteCode`;
  static accept = (id: string) => `${Endpoints.baseUrl}/channels/${id}/accept`;
  static reject = (id: string) => `${Endpoints.baseUrl}/channels/${id}/reject`;
  static members = (channelId: string) => `${Endpoints.baseUrl}/channels/${channelId}/members`;
  static memberById = (channelId: string, userId: string) => 
    `${Endpoints.baseUrl}/channels/${channelId}/members/${userId}`;
  static readonly cleanup = `${Endpoints.baseUrl}/channels/cleanup`;
  static deleteChannel = (id: string) => `${Endpoints.baseUrl}/channels/${id}`;
  static readonly joinByInvite = `${Endpoints.baseUrl}/channels/join-by-invite`;
  static readonly leaveChannel = `${Endpoints.baseUrl}/channels/leave`;
  static invitationsForUser = (userId: string) => `${Endpoints.baseUrl}/users/${userId}/invitations`;
  static respondInvitation = (invitationId: string) => `${Endpoints.baseUrl}/invitations/${invitationId}/respond`;
  static invite = (channelId: string) => `${Endpoints.baseUrl}/channels/${channelId}/invite`;
  static hasPendingInvitation = (channelId: string, inviteeId: string) => 
    `${Endpoints.baseUrl}/channels/${channelId}/invitations/pending/${inviteeId}`;

  // Assistant endpoints
  static readonly assistants = `${Endpoints.baseUrl}/assistants`;
  static assistantById = (assistantId: string) => `${Endpoints.baseUrl}/assistants/${assistantId}`;
  static assistantsByUser = (userId: string) => `${Endpoints.baseUrl}/assistants/user/${userId}`;

  // Event endpoints
  static readonly events = `${Endpoints.baseUrl}/events`;
  static eventById = (id: string) => `${Endpoints.baseUrl}/events/${id}`;
  static eventByUserId = (userId: string) => `${Endpoints.baseUrl}/events/user/${userId}`;

  // Point endpoints
  static pointEarn = (userId: string) => `${Endpoints.baseUrl}/point/${userId}/earn`;
  static pointUse = (userId: string) => `${Endpoints.baseUrl}/point/${userId}/use`;
  static pointAdjust = (userId: string) => `${Endpoints.baseUrl}/point/${userId}/adjust`;
  static pointHistory = (userId: string) => `${Endpoints.baseUrl}/point/${userId}/history`;

  // Couple analysis endpoints
  static coupleAnalysisByChannelId = (channelId: string) => 
    `${Endpoints.baseUrl}/couple-analysis/${channelId}`;
  static coupleAnalysisByChannelIdLatest = (channelId: string) => 
    `${Endpoints.baseUrl}/couple-analysis/${channelId}/latest`;
  static coupleAnalysisLlm = (channelId: string) => 
    `${Endpoints.baseUrl}/couple-analysis/${channelId}/llm`;

  // Advice endpoints
  static adviceHistories = (channelId: string) => `${Endpoints.baseUrl}/advice/channel/${channelId}`;
  static adviceHistoryLatest = (channelId: string) => `${Endpoints.baseUrl}/advice/channel/${channelId}/latest`;

  // Chat endpoints
  static chatHistory = (channelId: string, userId: string) => 
    `${Endpoints.baseUrl}/chat/${channelId}/${userId}/history`;
  static sendMessage = (channelId: string, userId: string) => 
    `${Endpoints.baseUrl}/chat/${channelId}/${userId}/message`;
  static readonly getChats = `${Endpoints.baseUrl}/chat/list?pageRows=10&pageNumber=1&languageType=EN`;
  static readonly chat = `${Endpoints.baseUrl}/chat`;
  static chatHistories = (assistantId: string) => `${Endpoints.baseUrl}/chat/${assistantId}/histories`;

  // Category codes
  static readonly getCategoryCodes = `${Endpoints.baseUrl}/category-codes`;

  // Payment subscription endpoints
  static readonly paymentSubscription = `${Endpoints.baseUrl}/payment_subscription`;
  static readonly paymentSubscriptionCurrent = `${Endpoints.baseUrl}/payment-subscription/current`;
  static readonly paymentSubscriptionVerify = `${Endpoints.baseUrl}/payment-subscription/verify`;
  static readonly paymentSubscriptionSave = `${Endpoints.baseUrl}/payment-subscription/save`;
  static readonly paymentSubscriptionHistories = `${Endpoints.baseUrl}/payment-subscription/subscription-histories`;
  static paymentSubscriptionHistoriesByUser = (userId: string) => 
    `${Endpoints.baseUrl}/payment-subscription/${userId}/subscription-histories`;
} 