export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  // Users
  USERS: '/users',
  USER_PROFILE: '/users/me',
  USER_SEARCH: '/users/search',

  // Channels
  CHANNELS: '/channels',
  CHANNEL_MEMBERS: (channelId: string) => `/channels/${channelId}/members`,
  CHANNEL_MESSAGES: (channelId: string) => `/channels/${channelId}/messages`,

  // Messages
  MESSAGES: '/messages',
  MESSAGE_REACTIONS: (messageId: string) => `/messages/${messageId}/reactions`,
} as const;

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
