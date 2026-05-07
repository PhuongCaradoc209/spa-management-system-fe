import React from "react";
import AppButton from "@/components/common/AppButton";
import TableSkeletonRows from "@/components/common/TableSkeletonRows";
import { AppointmentStatus } from "@/constant/enum/appointment.enum";
import AdminHistoryRow from "./AdminHistoryRow";
import {
  formatCurrency,
  formatDateParts,
  formatPersonName,
  formatServiceName,
  getStatusMeta,
  useAdminAppointments,
} from "../hooks/useAdminAppointments";

const AdminHistoryTable: React.FC = () => {
  const {
    appointments,
    total,
    page,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    hasNextPage,
    isLoading,
    isError,
    isMutating,
    resetFilters,
    selectAppointment,
    clearSelection,
    selectedAppointment,
    detailLoading,
    detailError,
    advanceStatus,
    cancelAppointment,
    setTodayFilter,
  } = useAdminAppointments();

  console.log("Appointments:", appointments);

  const statusOptions = [
    { value: "", label: "All Status" },
    ...Object.values(AppointmentStatus).map((status) => ({
      value: status,
      label: status.replace(/_/g, " "),
    })),
  ];

  const selectedDetail = selectedAppointment;
  const detailStatusMeta = getStatusMeta(String(selectedDetail?.status ?? ""));
  const detailDate = formatDateParts(selectedDetail?.scheduledAt);

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-4">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-fixed focus:bg-white transition-all outline-none"
            placeholder="Search customer or service..."
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center overflow-x-auto no-scrollbar w-full md:w-auto">
          <div className="relative">
            <input
              className="rounded-full border border-outline-variant/30 bg-white px-4 py-2 text-[10px] uppercase tracking-widest text-on-surface-variant"
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </div>
          <AppButton
            variant="outline"
            size="sm"
            iconLeft="calendar_today"
            className="bg-white"
            onClick={setTodayFilter}
          >
            Today
          </AppButton>
          <div className="relative">
            <select
              className="rounded-full border border-outline-variant/30 bg-white px-4 py-2 text-[10px] uppercase tracking-widest text-on-surface-variant"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as AppointmentStatus | "")
              }
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <AppButton
            variant="outline"
            size="sm"
            iconLeft="refresh"
            className="bg-white"
            onClick={resetFilters}
          >
            Refresh
          </AppButton>
        </div>
      </div>

      {selectedDetail && (
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-outline-variant/30 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Appointment Detail
              </p>
              <h3 className="text-lg font-headline font-semibold text-primary">
                {formatPersonName(selectedDetail.customer)}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${detailStatusMeta.className}`}
              >
                {detailStatusMeta.label}
              </span>
              <AppButton
                variant="outline"
                size="sm"
                iconLeft="close"
                className="bg-white"
                onClick={clearSelection}
              >
                Close
              </AppButton>
            </div>
          </div>

          {detailLoading && (
            <div className="mt-4 space-y-2">
              <div className="h-4 w-40 rounded-full bg-surface-container-high animate-pulse" />
              <div className="h-4 w-56 rounded-full bg-surface-container-high animate-pulse" />
            </div>
          )}
          {detailError && !detailLoading && (
            <div className="mt-4 text-xs text-on-surface-variant/60">
              Unable to load appointment detail.
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Appointment ID
              </p>
              <p className="text-on-surface">
                {selectedDetail.id ?? selectedDetail.appointmentId ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Staff
              </p>
              <p className="text-on-surface">
                {formatPersonName(selectedDetail.staff)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Services
              </p>
              <p className="text-on-surface">
                {formatServiceName(selectedDetail.services)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Scheduled
              </p>
              <p className="text-on-surface">
                {detailDate.date} · {detailDate.time}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                Total
              </p>
              <p className="text-on-surface">
                {formatCurrency(
                  selectedDetail.totalAmount ??
                    selectedDetail.totalPrice ??
                    selectedDetail.price,
                  selectedDetail.currency,
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modern Data Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-outline-variant/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Customer
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Service Type
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Staff
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Date & Time
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Price
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Status
              </th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {isLoading && <TableSkeletonRows rows={6} columns={7} />}
            {isError && !isLoading && (
              <tr>
                <td
                  className="px-6 py-10 text-center text-sm text-on-surface-variant/60"
                  colSpan={7}
                >
                  Failed to load appointments. Please refresh.
                </td>
              </tr>
            )}
            {!isLoading && !isError && appointments.length === 0 && (
              <tr>
                <td
                  className="px-6 py-10 text-center text-sm text-on-surface-variant/60"
                  colSpan={7}
                >
                  No appointments found.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              appointments.map((appointment) => (
                <AdminHistoryRow
                  key={appointment.id ?? appointment.appointmentId}
                  appointment={appointment}
                  disableActions={isMutating}
                  onViewDetail={selectAppointment}
                  onAdvance={advanceStatus}
                  onCancel={cancelAppointment}
                />
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center px-4 py-2">
        <p className="text-xs text-on-surface-variant/40 uppercase tracking-widest font-label">
          Showing {appointments.length} of {total} records
        </p>
        <div className="flex gap-2">
          <AppButton
            variant="outline"
            size="sm"
            iconLeft="chevron_left"
            className="p-2 min-w-0"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          />
          <AppButton
            variant="outline"
            size="sm"
            iconLeft="chevron_right"
            className="p-2 min-w-0"
            disabled={!hasNextPage}
            onClick={() => setPage((current) => current + 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHistoryTable;
