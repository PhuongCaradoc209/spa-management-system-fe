import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { staffService } from "@/services/staff.service";
import { staffScheduleService } from "@/services/staff-schedule.service";
import { StatusPill } from "./StatusPill";
import { dayOfWeekLabel } from "../utils/dayOfWeekLabel";
import AppButton from "@/components/common/AppButton";
import AppModal from "@/components/common/AppModal";
import AppConfirmModal from "@/components/common/AppConfirmModal";
import TableSkeletonRows from "@/components/common/TableSkeletonRows";
import { isAxiosError } from "axios";

const extractItems = (payload: unknown) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  const p = payload as Record<string, unknown>;
  return (p.items ?? p.data ?? p.schedules ?? []) as Record<string, unknown>[];
};

const extractStaffItems = (payload: unknown) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  const p = payload as Record<string, unknown>;
  return (p.items ??
    p.data ??
    p.staff ??
    p.staffs ??
    p.results ??
    []) as Record<string, unknown>[];
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;

const normalizeTime = (value: unknown) => {
  const s = String(value ?? "");
  if (!s) return "";
  // Accept HH:mm or HH:mm:ss and trim to HH:mm for <input type="time" />
  if (s.length >= 5 && s[2] === ":") return s.slice(0, 5);
  return s;
};

type ApiErrorResponse = {
  message?: string;
};

type ScheduleMode = "create" | "edit";

export const SchedulesTable: React.FC = () => {
  const queryClient = useQueryClient();

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedStaffName, setSelectedStaffName] = useState<string>("");

  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");

  const [mode, setMode] = useState<ScheduleMode>("create");
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null,
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(
    null,
  );

  const [form, setForm] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "18:00",
    isWorkingDay: true,
  });

  const { data: staffData, isLoading: staffLoading } = useQuery({
    queryKey: ["admin", "staff"],
    queryFn: () => staffService.listStaff({ includeUnavailable: "true" }),
    staleTime: 60_000,
  });

  const {
    data: scheduleData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "staff", selectedStaffId, "schedules"],
    queryFn: () => staffScheduleService.listSchedules(selectedStaffId),
    enabled: Boolean(selectedStaffId),
    staleTime: 60_000,
  });

  const staffRows = useMemo(() => {
    return extractStaffItems(staffData)
      .map((raw) => {
        const staffId = String(raw.id ?? raw.staffId ?? raw._id ?? "");
        if (!staffId) return null;
        const first = String(raw.firstName ?? "");
        const last = String(raw.lastName ?? "");
        const fullName = String(raw.fullName ?? raw.name ?? "");
        const name = [first, last].filter(Boolean).join(" ") || fullName;

        const user = asRecord(raw.user);
        const email = String(raw.email ?? user?.email ?? "");
        const isAvailable =
          typeof raw.isAvailable === "boolean" ? raw.isAvailable : undefined;

        return {
          id: staffId,
          name: name || email || staffId,
          email,
          isAvailable,
        };
      })
      .filter(Boolean) as {
      id: string;
      name: string;
      email: string;
      isAvailable?: boolean;
    }[];
  }, [staffData]);

  const filteredStaffRows = useMemo(() => {
    const q = staffSearch.trim().toLowerCase();
    if (!q) return staffRows;
    return staffRows.filter((s) => {
      const hay = `${s.name} ${s.email}`.toLowerCase();
      return hay.includes(q);
    });
  }, [staffRows, staffSearch]);

  const scheduleRows = useMemo(() => {
    return extractItems(scheduleData)
      .map((raw) => {
        const scheduleId = String(raw.id ?? raw.scheduleId ?? raw._id ?? "");
        if (!scheduleId) return null;
        const dayRaw = raw.dayOfWeek;
        const dayOfWeek =
          typeof dayRaw === "number"
            ? dayRaw
            : typeof dayRaw === "string" && dayRaw.trim() !== ""
              ? Number(dayRaw)
              : undefined;
        return {
          id: scheduleId,
          dayOfWeek: Number.isFinite(dayOfWeek as number)
            ? (dayOfWeek as number)
            : undefined,
          startTime: normalizeTime(raw.startTime),
          endTime: normalizeTime(raw.endTime),
          isWorkingDay: raw.isWorkingDay as boolean | undefined,
        };
      })
      .filter(Boolean) as {
      id: string;
      dayOfWeek?: number;
      startTime: string;
      endTime: string;
      isWorkingDay?: boolean;
    }[];
  }, [scheduleData]);

  const createMutation = useMutation({
    mutationFn: (payload: {
      staffId: string;
      body: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isWorkingDay: boolean;
      };
    }) => staffScheduleService.createSchedule(payload.staffId, payload.body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "staff", selectedStaffId, "schedules"],
      });
      setIsUpsertOpen(false);
      setEditingScheduleId(null);
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Create schedule failed.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: {
      staffId: string;
      scheduleId: string;
      body: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isWorkingDay: boolean;
      };
    }) =>
      staffScheduleService.updateSchedule(
        payload.staffId,
        payload.scheduleId,
        payload.body,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "staff", selectedStaffId, "schedules"],
      });
      setIsUpsertOpen(false);
      setEditingScheduleId(null);
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Update schedule failed.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (payload: { staffId: string; scheduleId: string }) =>
      staffScheduleService.deleteSchedule(payload.staffId, payload.scheduleId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "staff", selectedStaffId, "schedules"],
      });
      setIsDeleteOpen(false);
      setDeletingScheduleId(null);
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Delete schedule failed.");
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-headline font-semibold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">edit_calendar</span>
          Shift Schedule
        </h2>
        <div className="flex gap-3 items-center">
          <AppButton
            variant="ghost"
            size="md"
            iconLeft="person_search"
            type="button"
            onClick={() => setIsStaffPickerOpen(true)}
            disabled={staffLoading}
          >
            {selectedStaffName || "Select staff"}
          </AppButton>
          <AppButton
            variant="secondary"
            size="md"
            iconLeft="add"
            type="button"
            onClick={() => {
              if (!selectedStaffId) {
                alert("Please select a staff first.");
                return;
              }
              setMode("create");
              setEditingScheduleId(null);
              setForm({
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "18:00",
                isWorkingDay: true,
              });
              setIsUpsertOpen(true);
            }}
          >
            Assign Shift
          </AppButton>
        </div>
      </div>

      <AppModal
        open={isStaffPickerOpen}
        title="Select Staff"
        description="Search and choose a staff member to manage schedules."
        onClose={() => setIsStaffPickerOpen(false)}
        footer={
          <>
            <AppButton
              variant="ghost"
              size="md"
              type="button"
              onClick={() => setIsStaffPickerOpen(false)}
            >
              Close
            </AppButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
              Search
            </label>
            <input
              className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
              placeholder="Type name or email..."
            />
          </div>

          <div className="max-h-[360px] overflow-auto rounded-2xl border border-outline-variant/30 bg-white">
            {staffLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-12 w-full animate-pulse rounded-xl bg-surface-container-low"
                  />
                ))}
              </div>
            ) : filteredStaffRows.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-on-surface-variant/60">
                No staff found.
              </div>
            ) : (
              <ul className="divide-y divide-outline-variant/10">
                {filteredStaffRows.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-surface-container-low/40 transition-colors"
                      onClick={() => {
                        setSelectedStaffId(s.id);
                        setSelectedStaffName(s.name);
                        setIsStaffPickerOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-on-surface truncate">
                            {s.name}
                          </div>
                          <div className="text-xs text-on-surface-variant/70 truncate">
                            {s.email || ""}
                          </div>
                        </div>
                        <div className="shrink-0">
                          {typeof s.isAvailable === "boolean" ? (
                            s.isAvailable ? (
                              <StatusPill label="Available" variant="ok" />
                            ) : (
                              <StatusPill label="Unavailable" variant="muted" />
                            )
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </AppModal>

      <AppModal
        open={isUpsertOpen}
        title={mode === "create" ? "Assign Shift" : "Edit Shift"}
        description="Configure weekly working hours."
        onClose={() => {
          if (createMutation.isPending || updateMutation.isPending) return;
          setIsUpsertOpen(false);
          setEditingScheduleId(null);
        }}
        footer={
          <>
            <AppButton
              variant="ghost"
              size="md"
              type="button"
              onClick={() => {
                setIsUpsertOpen(false);
                setEditingScheduleId(null);
              }}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </AppButton>
            <AppButton
              variant="primary"
              size="md"
              type="button"
              loading={
                mode === "create"
                  ? createMutation.isPending
                  : updateMutation.isPending
              }
              onClick={() => {
                if (!selectedStaffId) return;
                if (!form.startTime || !form.endTime) {
                  alert("Start/End time are required.");
                  return;
                }
                const body = {
                  dayOfWeek: form.dayOfWeek,
                  startTime: form.startTime,
                  endTime: form.endTime,
                  isWorkingDay: form.isWorkingDay,
                };
                if (mode === "create") {
                  createMutation.mutate({ staffId: selectedStaffId, body });
                  return;
                }
                if (!editingScheduleId) return;
                updateMutation.mutate({
                  staffId: selectedStaffId,
                  scheduleId: editingScheduleId,
                  body,
                });
              }}
            >
              {mode === "create" ? "Create" : "Save"}
            </AppButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
              Day of week
            </label>
            <select
              className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={form.dayOfWeek}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  dayOfWeek: Number(e.target.value),
                }))
              }
            >
              {Array.from({ length: 7 }).map((_, idx) => (
                <option key={idx} value={idx}>
                  {dayOfWeekLabel(idx)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
              Start time
            </label>
            <input
              type="time"
              className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={form.startTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startTime: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
              End time
            </label>
            <input
              type="time"
              className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={form.endTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, endTime: e.target.value }))
              }
            />
          </div>

          <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
              checked={form.isWorkingDay}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isWorkingDay: e.target.checked,
                }))
              }
            />
            Working day
          </label>
        </div>
      </AppModal>

      <AppConfirmModal
        open={isDeleteOpen}
        title="Delete schedule?"
        description="This will permanently delete this schedule entry."
        confirmText="Yes, delete"
        cancelText="Cancel"
        confirmIcon="delete"
        isConfirmLoading={deleteMutation.isPending}
        onClose={() => {
          if (deleteMutation.isPending) return;
          setIsDeleteOpen(false);
          setDeletingScheduleId(null);
        }}
        onConfirm={() => {
          if (!selectedStaffId || !deletingScheduleId) return;
          deleteMutation.mutate({
            staffId: selectedStaffId,
            scheduleId: deletingScheduleId,
          });
        }}
      />

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-outline-variant/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Day
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Start
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                End
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Working
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {!selectedStaffId && !staffLoading && (
              <tr>
                <td
                  className="px-6 py-10 text-center text-sm text-on-surface-variant/60"
                  colSpan={5}
                >
                  Select a staff member to view schedules.
                </td>
              </tr>
            )}
            {isLoading && <TableSkeletonRows columns={5} rows={6} />}
            {isError && !isLoading && (
              <tr>
                <td
                  className="px-6 py-10 text-center text-sm text-on-surface-variant/60"
                  colSpan={5}
                >
                  Failed to load.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              scheduleRows.length === 0 &&
              selectedStaffId && (
                <tr>
                  <td
                    className="px-6 py-10 text-center text-sm text-on-surface-variant/60"
                    colSpan={5}
                  >
                    No schedules found.
                  </td>
                </tr>
              )}
            {scheduleRows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-surface-container-low/40 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-on-surface">
                  {dayOfWeekLabel(row.dayOfWeek)}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {row.startTime || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {row.endTime || "-"}
                </td>
                <td className="px-6 py-4">
                  {row.isWorkingDay === false ? (
                    <StatusPill label="Off" variant="muted" />
                  ) : (
                    <StatusPill label="On" variant="ok" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                      aria-label="Edit"
                      onClick={() => {
                        if (!selectedStaffId) return;
                        setMode("edit");
                        setEditingScheduleId(row.id);
                        setForm({
                          dayOfWeek:
                            typeof row.dayOfWeek === "number"
                              ? row.dayOfWeek
                              : 1,
                          startTime: row.startTime || "09:00",
                          endTime: row.endTime || "18:00",
                          isWorkingDay: row.isWorkingDay !== false,
                        });
                        setIsUpsertOpen(true);
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        edit
                      </span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                      aria-label="Delete"
                      onClick={() => {
                        setDeletingScheduleId(row.id);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
