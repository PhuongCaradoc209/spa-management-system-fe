export const AppointmentStatus = {
  Pending: "PENDING",
  Confirmed: "CONFIRMED",
  InProgress: "IN_PROGRESS",
  Completed: "COMPLETED",
  Cancelled: "CANCELLED",
  NoShow: "NO_SHOW",
} as const;
export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus];
