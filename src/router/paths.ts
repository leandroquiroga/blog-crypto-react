export const paths = {
  home: '/',
  dashboard: '/dashboard',
  portfolio: '/portfolio',
  login: '/login',
  register: '/register',
  resetPassword: '/login/reset-password',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];
