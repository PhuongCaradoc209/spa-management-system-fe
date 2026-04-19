export const NAV_PATH = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  SCHEDULE: "/schedule",
  ADMIN: "/admin",
} as const;
export type NavPath = (typeof NAV_PATH)[keyof typeof NAV_PATH];
