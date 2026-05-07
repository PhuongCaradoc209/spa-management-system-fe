import React from "react";
import AppButton from "@/components/common/AppButton";
import {
  AppointmentStatus,
  type AppointmentStatus as AppointmentStatusType,
} from "@/constant/enum/appointment.enum";
import {
  formatCurrency,
  formatDateParts,
  formatPersonName,
  formatServiceName,
  getStatusMeta,
  type AppointmentListItem,
} from "../hooks/useAdminAppointments";

type AdminHistoryRowProps = {
  appointment: AppointmentListItem;
  onViewDetail: (id: string) => void;
  onAdvance: (
    id: string,
    current?: AppointmentStatusType | string | null,
  ) => void;
  onCancel: (id: string) => void;
  disableActions?: boolean;
};

const AdminHistoryRow: React.FC<AdminHistoryRowProps> = ({
  appointment,
  onViewDetail,
  onAdvance,
  onCancel,
  disableActions,
}) => {
  const appointmentId = appointment.id ?? appointment.appointmentId;
  const { date, time } = formatDateParts(appointment.scheduledAt);
  const statusValue = appointment.status ?? AppointmentStatus.Pending;
  const statusMeta = getStatusMeta(String(statusValue));
  const canAdvance =
    statusValue === AppointmentStatus.Pending ||
    statusValue === AppointmentStatus.Confirmed ||
    statusValue === AppointmentStatus.InProgress;
  const canCancel =
    statusValue !== AppointmentStatus.Cancelled &&
    statusValue !== AppointmentStatus.Completed;

  const advanceIcon =
    statusValue === AppointmentStatus.Pending
      ? "check_circle"
      : statusValue === AppointmentStatus.Confirmed
        ? "play_circle"
        : statusValue === AppointmentStatus.InProgress
          ? "done_all"
          : "check_circle";

  if (!appointmentId) {
    return null;
  }

  return (
    <tr className="hover:bg-surface-container-lowest transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <img
              alt={formatPersonName(appointment.customer)}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              src={
                appointment.customer?.avatarUrl ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD6f1fe_NCwxFMop4truMUyfw0PDHA9a-CnF-VBdHbfohAaIqUqKMVZN0CKxpIhpYai940OkxxB_i0NucrdL3cW7COS-bsaadGb7X5ZprxmBWyFgDyr_X764_k5D2G2KJkBQR-rxVR1130btZWiAxH5F6z-zHKr_t17HqM4tD0Es2movbyDHeBEVOc10FF3uiwjgq8cjYBmEAeDm0k2Z8GH0gB-LQdF4v-VhpwbY9Fv3yKhR_RN1BvwMW0QWl7TjStBmobHcO3W_8I"
              }
            />
          </div>
          <span className="font-medium text-on-surface">
            {formatPersonName(appointment.customer)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span className="text-sm text-on-surface-variant">
            {formatServiceName(appointment.services)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-on-surface-variant">
        {formatPersonName(appointment.staff)}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-on-surface">{date}</div>
        <div className="text-[10px] text-on-surface-variant/40 uppercase tracking-wider">
          {time}
        </div>
      </td>
      <td className="px-6 py-4 font-medium text-primary">
        {formatCurrency(
          appointment.totalAmount ??
            appointment.totalPrice ??
            appointment.price,
          appointment.currency,
        )}
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusMeta.className}`}
        >
          {statusMeta.label}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <AppButton
            variant="ghost"
            size="sm"
            iconLeft="visibility"
            className="p-2 min-w-0"
            disabled={disableActions}
            aria-label="View detail"
            onClick={() => onViewDetail(appointmentId)}
          />
          <AppButton
            variant="ghost"
            size="sm"
            iconLeft={advanceIcon}
            className="p-2 min-w-0"
            disabled={!canAdvance || disableActions}
            aria-label="Advance status"
            onClick={() => onAdvance(appointmentId, statusValue)}
          />
          <AppButton
            variant="ghost"
            size="sm"
            iconLeft="cancel"
            className="p-2 min-w-0"
            disabled={!canCancel || disableActions}
            aria-label="Cancel appointment"
            onClick={() => onCancel(appointmentId)}
          />
        </div>
      </td>
    </tr>
  );
};

export default AdminHistoryRow;
