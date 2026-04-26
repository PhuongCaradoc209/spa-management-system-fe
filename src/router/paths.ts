export const NAV_PATH = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  SCHEDULE: "/schedule",
  ADMIN: "/admin",
  BOOKING: "/booking",
  THERAPIST: "/therapist"
} as const;
export type NavPath = (typeof NAV_PATH)[keyof typeof NAV_PATH];
