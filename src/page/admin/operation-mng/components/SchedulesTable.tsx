import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { staffScheduleService } from "@/services/staff-schedule.service";
import { StatusPill } from "./StatusPill";
import { dayOfWeekLabel } from "../utils/dayOfWeekLabel";

const extractItems = (payload: unknown) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  const p = payload as Record<string, unknown>;
  return (p.items ?? p.data ?? p.schedules ?? []) as Record<string, unknown>[];
};

export const SchedulesTable: React.FC = () => {
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const { data: staffData, isLoading: staffLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => userService.listUsers(),
    staleTime: 60_000,
  });

  const { data: scheduleData, isLoading, isError } = useQuery({
    queryKey: ["admin", "staff", selectedStaffId, "schedules"],
    queryFn: () => staffScheduleService.listSchedules(selectedStaffId),
    enabled: Boolean(selectedStaffId),
    staleTime: 60_000,
  });

  const staffRows = extractItems(staffData)
    .map((raw) => ({ id: String(raw.id ?? raw.userId ?? ""), name: [String(raw.firstName ?? ""), String(raw.lastName ?? "")].filter(Boolean).join(" ") || String(raw.fullName ?? raw.name ?? "") }))
    .filter((r) => r.id);

  const scheduleRows = extractItems(scheduleData).map((raw) => ({
    id: String(raw.id ?? raw.scheduleId ?? `${raw.dayOfWeek}-${raw.startTime}`),
    dayOfWeek: typeof raw.dayOfWeek === "number" ? raw.dayOfWeek : undefined,
    startTime: String(raw.startTime ?? ""),
    endTime: String(raw.endTime ?? ""),
    isWorkingDay: raw.isWorkingDay as boolean | undefined,
  })).filter((r) => r.id);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-headline font-semibold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">edit_calendar</span>
          Shift Schedule
        </h2>
        <div className="flex gap-3 items-center">
          <select
            className="rounded-full border border-outline-variant/30 bg-white px-4 py-2 text-[10px] uppercase tracking-widest text-on-surface-variant"
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
          >
            <option value="">Select staff</option>
            {staffRows.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button className="px-4 py-2 bg-secondary text-white rounded-full text-xs font-bold">Assign Shift</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-outline-variant/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Day</th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Start</th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">End</th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Working</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {!selectedStaffId && !staffLoading && <tr><td className="px-6 py-10 text-center text-sm text-on-surface-variant/60" colSpan={4}>Select a staff member to view schedules.</td></tr>}
            {isLoading && <tr><td className="px-6 py-10 text-center text-sm text-on-surface-variant/60" colSpan={4}>Loading...</td></tr>}
            {isError && !isLoading && <tr><td className="px-6 py-10 text-center text-sm text-on-surface-variant/60" colSpan={4}>Failed to load.</td></tr>}
            {!isLoading && !isError && scheduleRows.length === 0 && selectedStaffId && <tr><td className="px-6 py-10 text-center text-sm text-on-surface-variant/60" colSpan={4}>No schedules found.</td></tr>}
            {scheduleRows.map((row) => (
              <tr key={row.id} className="hover:bg-surface-container-low/40 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-on-surface">{dayOfWeekLabel(row.dayOfWeek)}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{row.startTime || "-"}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{row.endTime || "-"}</td>
                <td className="px-6 py-4">{row.isWorkingDay === false ? <StatusPill label="Off" variant="muted" /> : <StatusPill label="On" variant="ok" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};