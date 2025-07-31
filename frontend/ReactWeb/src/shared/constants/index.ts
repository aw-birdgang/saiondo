export const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTH: '/api/auth',
  PROFILE: '/api/users/profile',
} as const;

export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const; 