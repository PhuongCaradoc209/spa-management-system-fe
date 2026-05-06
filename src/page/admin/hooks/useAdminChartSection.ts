import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  normalizeAppointments,
  type AppointmentListItem,
  type AppointmentListPayload,
} from "@/page/admin/hooks/useAdminAppointments";
import { appointmentService } from "@/services/appointment.service";
import { AppointmentStatus } from "@/constant/enum/appointment.enum";

export type AdminChartMonthDatum = {
  label: string;
  heightPercent: number;
  count: number;
};

export type AdminWeeklyGoal = {
  percent: number;
  completedCount: number;
  goalCount: number;
};

const FALLBACK_MONTH_HEIGHTS = [45, 60, 75, 55, 90, 70];
const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toDate = (value: unknown) => {
  if (!value) return undefined;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value;
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
};

const getScheduledAt = (item: AppointmentListItem) => {
  const direct = item.scheduledAt;
  if (direct) return direct;
  const anyItem = item as Record<string, unknown>;
  const candidates = [
    anyItem.scheduled_at,
    anyItem.startAt,
    anyItem.start_at,
    anyItem.date,
    anyItem.createdAt,
    anyItem.created_at,
  ];
  const first = candidates.find((v) => typeof v === "string" && v);
  return typeof first === "string" ? first : undefined;
};

const getStatus = (item: AppointmentListItem) => {
  const raw = item.status;
  if (!raw) return undefined;
  return String(raw).toUpperCase();
};

const getStartOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - day);
  return result;
};

export const useAdminChartSection = () => {
  const year = new Date().getFullYear();

  const appointmentsChartQuery = useQuery({
    queryKey: ["appointments", "adminChart", year],
    queryFn: async () => {
      const limit = 200;
      const maxPages = 10;
      const allItems: AppointmentListItem[] = [];

      for (let page = 1; page <= maxPages; page += 1) {
        const payload = (await appointmentService.listAppointments({
          page,
          limit,
        })) as AppointmentListPayload | AppointmentListItem[] | undefined;

        const { items } = normalizeAppointments(payload);
        if (!items.length) {
          break;
        }

        allItems.push(...items);
        if (items.length < limit) {
          break;
        }
      }

      return allItems;
    },
    staleTime: 60_000,
  });

  const months = useMemo<AdminChartMonthDatum[]>(() => {
    const items = appointmentsChartQuery.data ?? [];
    if (appointmentsChartQuery.isLoading || items.length === 0) {
      return MONTH_LABELS.map((label, idx) => ({
        label,
        heightPercent: FALLBACK_MONTH_HEIGHTS[idx] ?? 0,
        count: 0,
      }));
    }

    const counts = new Array(6).fill(0) as number[];

    for (const item of items) {
      const dateValue = toDate(getScheduledAt(item));
      if (!dateValue) continue;
      if (dateValue.getFullYear() !== year) continue;
      const month = dateValue.getMonth();
      if (month < 0 || month > 5) continue;
      counts[month] += 1;
    }

    const maxCount = Math.max(1, ...counts);

    return MONTH_LABELS.map((label, idx) => {
      const count = counts[idx] ?? 0;
      const height = Math.round((count / maxCount) * 100);
      return {
        label,
        count,
        heightPercent: clamp(height, 8, 100),
      };
    });
  }, [appointmentsChartQuery.data, appointmentsChartQuery.isLoading, year]);

  const weeklyGoal = useMemo<AdminWeeklyGoal>(() => {
    const items = appointmentsChartQuery.data ?? [];
    if (appointmentsChartQuery.isLoading || items.length === 0) {
      return { percent: 68, completedCount: 0, goalCount: 0 };
    }

    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const goalCount = 20;

    let completedCount = 0;
    for (const item of items) {
      const dateValue = toDate(getScheduledAt(item));
      if (!dateValue) continue;
      if (dateValue < startOfWeek || dateValue > now) continue;
      const status = getStatus(item);
      if (status === AppointmentStatus.Completed) {
        completedCount += 1;
      }
    }

    const percent = clamp(Math.round((completedCount / goalCount) * 100), 0, 100);
    return { percent, completedCount, goalCount };
  }, [appointmentsChartQuery.data, appointmentsChartQuery.isLoading]);

  return {
    months,
    weeklyGoal,
    isLoading: appointmentsChartQuery.isLoading,
    isError: appointmentsChartQuery.isError,
    refetch: appointmentsChartQuery.refetch,
  };
};
