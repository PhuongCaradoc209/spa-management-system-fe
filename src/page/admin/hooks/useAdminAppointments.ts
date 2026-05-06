import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppointmentStatus } from "@/constant/enum/appointment.enum";
import { appointmentService } from "@/services/appointment.service";

export type AppointmentPerson = {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  avatarUrl?: string;
};

export type AppointmentServiceItem = {
  id?: string;
  name?: string;
  price?: number | string;
};

export type AppointmentListItem = {
  id?: string;
  appointmentId?: string;
  customer?: AppointmentPerson | null;
  staff?: AppointmentPerson | null;
  services?: AppointmentServiceItem[] | null;
  scheduledAt?: string | null;
  status?: AppointmentStatus | string | null;
  totalPrice?: number | string | null;
  price?: number | string | null;
  currency?: string | null;
};

export type AppointmentListPayload = {
  items?: AppointmentListItem[];
  data?: AppointmentListItem[];
  appointments?: AppointmentListItem[];
  total?: number;
  meta?: { total?: number };
};

export type AppointmentDetailPayload = AppointmentListItem & {
  data?: AppointmentListItem;
  appointment?: AppointmentListItem;
};

export const DEFAULT_PAGE_SIZE = 10;

const STATUS_META: Record<string, string> = {
  PENDING: "bg-surface-container text-on-surface-variant/70",
  CONFIRMED: "bg-secondary-container/20 text-secondary",
  IN_PROGRESS: "bg-secondary-container/20 text-secondary",
  COMPLETED: "bg-primary-container/20 text-primary",
  CANCELLED: "bg-outline-variant/30 text-on-surface-variant/70",
  NO_SHOW: "bg-outline-variant/30 text-on-surface-variant/70",
};

export const getStatusMeta = (status?: string | null) => {
  if (!status) {
    return {
      label: "Unknown",
      className: "bg-surface-container text-on-surface-variant/70",
    };
  }
  const metaClass = STATUS_META[status] ?? "bg-surface-container text-on-surface-variant/70";
  return { label: status.replace(/_/g, " "), className: metaClass };
};

export const normalizeAppointments = (
  payload: AppointmentListPayload | AppointmentListItem[] | undefined,
) => {
  if (!payload) {
    return { items: [] as AppointmentListItem[], total: 0 };
  }
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length };
  }
  const items = "items" in payload ? payload.items
    : "data" in payload ? (payload as { data?: AppointmentListItem[] }).data
    : "appointments" in payload ? (payload as { appointments?: AppointmentListItem[] }).appointments
    : undefined;
  const total = payload.total ?? payload.meta?.total ?? items?.length ?? 0;
  return { items: items ?? [], total };
};

export const normalizeAppointmentDetail = (
  payload: AppointmentDetailPayload | AppointmentListItem | undefined,
) => {
  if (!payload) {
    return undefined;
  }
  const p = payload as AppointmentDetailPayload;
  return p.data ?? p.appointment ?? payload;
};

export const formatPersonName = (person?: AppointmentPerson | null) => {
  if (!person) {
    return "-";
  }
  return (
    person.fullName ||
    person.name ||
    [person.firstName, person.lastName].filter(Boolean).join(" ") ||
    "-"
  );
};

export const formatServiceName = (services?: AppointmentServiceItem[] | null) => {
  if (!services || services.length === 0) {
    return "-";
  }
  return services.map((service) => service.name).filter(Boolean).join(", ");
};

export const formatCurrency = (
  value?: number | string | null,
  currency?: string | null,
) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  const numberValue = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numberValue)) {
    return String(value);
  }
  const safeCurrency = currency ?? "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 2,
    }).format(numberValue);
  } catch {
    return `${numberValue} ${safeCurrency}`;
  }
};

export const formatDateParts = (scheduledAt?: string | null) => {
  if (!scheduledAt) {
    return { date: "-", time: "-" };
  }
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) {
    return { date: scheduledAt, time: "-" };
  }
  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

export const useAdminAppointments = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "">("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      status: statusFilter || undefined,
      date: dateFilter || undefined,
    }),
    [page, statusFilter, dateFilter],
  );

  const appointmentsQuery = useQuery({
    queryKey: ["appointments", queryParams],
    queryFn: () => appointmentService.listAppointments(queryParams),
  });

  const { items, total } = normalizeAppointments(
    appointmentsQuery.data as AppointmentListPayload | AppointmentListItem[] | undefined,
  );

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return items;
    }
    return items.filter((item) => {
      const customerName = formatPersonName(item.customer).toLowerCase();
      const staffName = formatPersonName(item.staff).toLowerCase();
      const serviceName = formatServiceName(item.services).toLowerCase();
      return (
        customerName.includes(keyword) ||
        staffName.includes(keyword) ||
        serviceName.includes(keyword)
      );
    });
  }, [items, search]);

  const appointmentDetailQuery = useQuery({
    queryKey: ["appointments", selectedAppointmentId],
    queryFn: () =>
      appointmentService.getAppointmentDetail(selectedAppointmentId as string),
    enabled: Boolean(selectedAppointmentId),
  });

  const selectedAppointment = useMemo(() => {
    const detail = normalizeAppointmentDetail(
      appointmentDetailQuery.data as AppointmentDetailPayload | AppointmentListItem | undefined,
    );
    if (detail) {
      return detail;
    }
    if (!selectedAppointmentId) {
      return undefined;
    }
    return items.find(
      (item) => item.id === selectedAppointmentId || item.appointmentId === selectedAppointmentId,
    );
  }, [appointmentDetailQuery.data, items, selectedAppointmentId]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentService.updateAppointmentStatus(id, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string | null }) =>
      appointmentService.cancelAppointment(id, { reason }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const invoiceMutation = useMutation({
    mutationFn: (id: string) => appointmentService.generateAppointmentInvoice(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["appointments"] });

  return {
    appointments: filteredItems,
    total,
    page,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    pageSize: DEFAULT_PAGE_SIZE,
    hasNextPage: items.length >= DEFAULT_PAGE_SIZE,
    isLoading: appointmentsQuery.isLoading,
    isError: appointmentsQuery.isError,
    isMutating:
      updateStatusMutation.isPending ||
      cancelMutation.isPending ||
      invoiceMutation.isPending,
    refresh,
    selectAppointment: setSelectedAppointmentId,
    clearSelection: () => setSelectedAppointmentId(null),
    selectedAppointment,
    detailLoading: appointmentDetailQuery.isLoading,
    detailError: appointmentDetailQuery.isError,
    markCompleted: (id: string) =>
      updateStatusMutation.mutate({ id, status: AppointmentStatus.Completed }),
    cancelAppointment: (id: string) =>
      cancelMutation.mutate({ id, reason: "Cancelled by admin" }),
    generateInvoice: (id: string) => invoiceMutation.mutate(id),
    setTodayFilter: () => {
      const today = new Date();
      const formatted = today.toISOString().slice(0, 10);
      setDateFilter(formatted);
    },
  };
};
