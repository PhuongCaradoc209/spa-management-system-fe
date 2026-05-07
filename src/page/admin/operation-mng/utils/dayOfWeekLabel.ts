const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const dayOfWeekLabel = (dayOfWeek?: number): string => {
  if (dayOfWeek === undefined || dayOfWeek === null) return "-";
  const idx = Number(dayOfWeek);
  return Number.isFinite(idx) && idx >= 0 && idx <= 6 ? DAY_LABELS[idx] ?? "-" : String(dayOfWeek);
};