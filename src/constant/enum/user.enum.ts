export const UserRole = {
  Admin: "ADMIN",
  Staff: "STAFF",
  Customer: "CUSTOMER",
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];
