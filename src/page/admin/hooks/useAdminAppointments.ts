import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppointmentStatus } from "@/constant/enum/appointment.enum";
import { appointmentService } from "@/services/appointment.service";
import { useAdminDashboardMappings } from "@/page/admin/hooks/useAdminDashboardMappings";

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
  customerId?: string;
  staffId?: string;
  totalAmount?: number | string | null;
  customer?: AppointmentPerson | null;
  staff?: AppointmentPerson | null;
  services?: AppointmentServiceItem[] | null;
  scheduledAt?: string | null;
  status?: AppointmentStatus | string | null;
  totalPrice?: number | string | null;
  price?: number | string | null;
  currency?: string | null;
};

type AppointmentServiceRaw = {
  id?: string;
  serviceId?: string;
  priceSnapshot?: number | string;
  durationMin?: number;
  service?: { id?: string; name?: string; price?: number | string } | null;
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
  const metaClass =
    STATUS_META[status] ?? "bg-surface-container text-on-surface-variant/70";
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
  const items =
    "items" in payload
      ? payload.items
      : "data" in payload
        ? (payload as { data?: AppointmentListItem[] }).data
        : "appointments" in payload
          ? (payload as { appointments?: AppointmentListItem[] }).appointments
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

export const formatServiceName = (
  services?: AppointmentServiceItem[] | null,
) => {
  if (!services || services.length === 0) {
    return "-";
  }
  return services
    .map((service) => service.name)
    .filter(Boolean)
    .join(", ");
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
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

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

  const { usersMap, staffMap, servicesMap, customerProfilesMap } =
    useAdminDashboardMappings();

  const { items, total } = normalizeAppointments(
    appointmentsQuery.data as
      | AppointmentListPayload
      | AppointmentListItem[]
      | undefined,
  );

  const mappedItems = useMemo(() => {
    if (items.length === 0) return items;

    const buildPerson = (id?: string) => {
      if (!id) return undefined;
      const fromCustomerProfiles = customerProfilesMap[id] as
        | AppointmentPerson
        | undefined;
      const fromUsers = usersMap[id] as AppointmentPerson | undefined;
      const fromStaff = staffMap[id] as AppointmentPerson | undefined;
      return fromCustomerProfiles ?? fromUsers ?? fromStaff ?? undefined;
    };

    const buildServices = (
      raw?: AppointmentServiceItem[] | AppointmentServiceRaw[] | null,
    ) => {
      if (!raw || raw.length === 0) return raw;
      return raw.map((item) => {
        const candidate = item as AppointmentServiceRaw;
        const serviceId =
          candidate.serviceId ??
          candidate.service?.id ??
          (item as AppointmentServiceItem).id;
        const serviceRef = serviceId
          ? (servicesMap[serviceId] as AppointmentServiceItem | undefined)
          : undefined;
        return {
          id: serviceId ?? (item as AppointmentServiceItem).id,
          name:
            candidate.service?.name ??
            serviceRef?.name ??
            (item as AppointmentServiceItem).name,
          price:
            candidate.priceSnapshot ??
            candidate.service?.price ??
            (item as AppointmentServiceItem).price,
        } satisfies AppointmentServiceItem;
      });
    };

    const getTotalAmount = (
      item: AppointmentListItem,
      services: AppointmentServiceItem[] | null | undefined,
    ) => {
      if (
        item.totalAmount !== null &&
        item.totalAmount !== undefined &&
        item.totalAmount !== ""
      ) {
        return item.totalAmount;
      }
      if (
        item.totalPrice !== null &&
        item.totalPrice !== undefined &&
        item.totalPrice !== ""
      ) {
        return item.totalPrice;
      }
      if (
        item.price !== null &&
        item.price !== undefined &&
        item.price !== ""
      ) {
        return item.price;
      }
      if (!services || services.length === 0) return undefined;
      const numeric = services
        .map((service) =>
          typeof service.price === "string"
            ? Number(service.price)
            : service.price,
        )
        .filter(
          (price): price is number =>
            typeof price === "number" && !Number.isNaN(price),
        );
      if (numeric.length === 0) return services[0]?.price;
      return numeric.reduce((acc, price) => acc + price, 0);
    };

    return items.map((item) => {
      const customerId =
        item.customerId ||
        (item as Record<string, string | undefined>).customerId;
      const staffId =
        item.staffId || (item as Record<string, string | undefined>).staffId;
      const mappedServices = buildServices(item.services);
      const totalAmount = getTotalAmount(item, mappedServices ?? undefined);
      return {
        ...item,
        customerId,
        staffId,
        customer: item.customer ?? buildPerson(customerId),
        staff: item.staff ?? buildPerson(staffId),
        services: mappedServices,
        totalAmount,
      };
    });
  }, [items, servicesMap, staffMap, usersMap, customerProfilesMap]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return mappedItems;
    }
    return mappedItems.filter((item) => {
      const customerName = formatPersonName(item.customer).toLowerCase();
      const staffName = formatPersonName(item.staff).toLowerCase();
      const serviceName = formatServiceName(item.services).toLowerCase();
      return (
        customerName.includes(keyword) ||
        staffName.includes(keyword) ||
        serviceName.includes(keyword)
      );
    });
  }, [mappedItems, search]);

  const appointmentDetailQuery = useQuery({
    queryKey: ["appointments", selectedAppointmentId],
    queryFn: () =>
      appointmentService.getAppointmentDetail(selectedAppointmentId as string),
    enabled: Boolean(selectedAppointmentId),
  });

  const selectedAppointment = useMemo(() => {
    const detail = normalizeAppointmentDetail(
      appointmentDetailQuery.data as
        | AppointmentDetailPayload
        | AppointmentListItem
        | undefined,
    );
    if (detail) {
      const customerId =
        detail.customerId ||
        (detail as Record<string, string | undefined>).customerId;
      const staffId =
        detail.staffId ||
        (detail as Record<string, string | undefined>).staffId;
      const customer =
        detail.customer ??
        customerProfilesMap[customerId ?? ""] ??
        usersMap[customerId ?? ""] ??
        undefined;
      const staff = detail.staff ?? staffMap[staffId ?? ""] ?? undefined;
      const services =
        detail.services ??
        mappedItems.find(
          (item) =>
            item.id === detail.id ||
            item.appointmentId === detail.appointmentId,
        )?.services;
      const totalAmount =
        detail.totalAmount ??
        mappedItems.find(
          (item) =>
            item.id === detail.id ||
            item.appointmentId === detail.appointmentId,
        )?.totalAmount;
      return {
        ...detail,
        customerId,
        staffId,
        customer,
        staff,
        services,
        totalAmount,
      };
    }
    if (!selectedAppointmentId) {
      return undefined;
    }
    return mappedItems.find(
      (item) =>
        item.id === selectedAppointmentId ||
        item.appointmentId === selectedAppointmentId,
    );
  }, [
    appointmentDetailQuery.data,
    mappedItems,
    selectedAppointmentId,
    staffMap,
    usersMap,
    customerProfilesMap,
  ]);

  const getNextStatus = (status?: AppointmentStatus | string | null) => {
    const current = String(status ?? AppointmentStatus.Pending).toUpperCase();
    switch (current) {
      case AppointmentStatus.Pending:
        return AppointmentStatus.Confirmed;
      case AppointmentStatus.Confirmed:
        return AppointmentStatus.InProgress;
      case AppointmentStatus.InProgress:
        return AppointmentStatus.Completed;
      default:
        return undefined;
    }
  };

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
    mutationFn: (id: string) =>
      appointmentService.generateAppointmentInvoice(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setDateFilter("");
    setPage(1);
    refresh();
  };

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
    resetFilters,
    selectAppointment: setSelectedAppointmentId,
    clearSelection: () => setSelectedAppointmentId(null),
    selectedAppointment,
    detailLoading: appointmentDetailQuery.isLoading,
    detailError: appointmentDetailQuery.isError,
    advanceStatus: (
      id: string,
      current?: AppointmentStatus | string | null,
    ) => {
      const nextStatus = getNextStatus(current);
      if (!nextStatus) return;
      updateStatusMutation.mutate({ id, status: nextStatus });
    },
    cancelAppointment: (id: string) =>
      cancelMutation.mutate({ id, reason: "Cancelled by admin" }),
    generateInvoice: (id: string) => invoiceMutation.mutate(id),
    getNextStatus,
    setTodayFilter: () => {
      const today = new Date();
      const formatted = today.toISOString().slice(0, 10);
      setDateFilter(formatted);
    },
  };
};
