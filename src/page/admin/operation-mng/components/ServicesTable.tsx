import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/service.service";
import { serviceCategoryService } from "@/services/service-category.service";
import { StatusPill } from "./StatusPill";
import TableSkeletonRows from "@/components/common/TableSkeletonRows";
import AppButton from "@/components/common/AppButton";
import AppModal from "@/components/common/AppModal";
import AppConfirmModal from "@/components/common/AppConfirmModal";
import { isAxiosError } from "axios";

const extractItems = (payload: unknown) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  const p = payload as Record<string, unknown>;
  return (p.items ?? p.data ?? p.services ?? []) as Record<string, unknown>[];
};

type ApiErrorResponse = {
  message?: string;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;

type UpsertMode = "create" | "edit";

const extractCategories = (payload: unknown) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  const p = payload as Record<string, unknown>;
  return (p.items ?? p.data ?? p.categories ?? []) as Record<string, unknown>[];
};

export const ServicesTable: React.FC = () => {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<UpsertMode>("create");
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingService, setDeletingService] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    durationMin: 60,
    price: "",
    description: "",
    imageUrl: "",
    isActive: true,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: () =>
      serviceService.listServices({
        page: 1,
        limit: 100,
        includeInactive: "true",
      }),
    staleTime: 60_000,
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["admin", "serviceCategories"],
    queryFn: () =>
      serviceCategoryService.listCategories({ includeInactive: "true" }),
    staleTime: 60_000,
  });

  const categoryOptions = useMemo(
    () =>
      extractCategories(categoryData)
        .map((raw) => ({
          id: String(raw.id ?? raw.categoryId ?? raw._id ?? ""),
          name: String(raw.name ?? "-"),
          isActive: raw.isActive as boolean | undefined,
        }))
        .filter((c) => c.id),
    [categoryData],
  );

  const categoryNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of categoryOptions) map[c.id] = c.name;
    return map;
  }, [categoryOptions]);

  const createServiceMutation = useMutation({
    mutationFn: serviceService.createService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      setIsUpsertOpen(false);
      setForm({
        categoryId: "",
        name: "",
        durationMin: 60,
        price: "",
        description: "",
        imageUrl: "",
        isActive: true,
      });
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Create service failed. Please try again.");
    },
  });

  const fetchServiceDetailMutation = useMutation({
    mutationFn: (serviceId: string) =>
      serviceService.getServiceDetail(serviceId, { includeInactive: "true" }),
    onSuccess: (payload: unknown) => {
      const root = asRecord(payload);
      const serviceRaw = (asRecord(root?.service) ?? root) as Record<
        string,
        unknown
      > | null;
      if (!serviceRaw) return;

      setForm((prev) => ({
        ...prev,
        categoryId: String(
          serviceRaw.categoryId ?? asRecord(serviceRaw.category)?.id ?? "",
        ),
        name: String(serviceRaw.name ?? ""),
        durationMin: Number(serviceRaw.durationMin ?? 60),
        price: String(serviceRaw.price ?? ""),
        description: String(serviceRaw.description ?? ""),
        imageUrl: String(serviceRaw.imageUrl ?? ""),
        isActive: Boolean(serviceRaw.isActive ?? true),
      }));
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Failed to fetch service detail.");
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: (input: {
      serviceId: string;
      payload: Parameters<typeof serviceService.updateService>[1];
    }) => serviceService.updateService(input.serviceId, input.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      setIsUpsertOpen(false);
      setEditingServiceId(null);
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Update service failed. Please try again.");
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (serviceId: string) => serviceService.deleteService(serviceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      setIsDeleteOpen(false);
      setDeletingService(null);
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Delete service failed. Please try again.");
    },
  });

  const rows = extractItems(data)
    .map((raw) => ({
      id: String(raw.id ?? raw.serviceId ?? raw._id ?? ""),
      categoryId: String(
        raw.categoryId ?? asRecord(raw.category)?.id ?? raw.category ?? "",
      ),
      name: String(raw.name ?? "-"),
      durationMin:
        typeof raw.durationMin === "number"
          ? raw.durationMin
          : typeof raw.duration === "number"
            ? raw.duration
            : undefined,
      price: (() => {
        const value = raw.price ?? raw.amount;
        if (typeof value === "number" || typeof value === "string")
          return value;
        return undefined;
      })(),
      isActive: raw.isActive as boolean | undefined,
      categoryName: String(raw.categoryName ?? ""),
    }))
    .filter((r) => r.id);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-headline font-semibold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">spa</span>
          Services
        </h2>
        <AppButton
          variant="primary"
          size="md"
          iconLeft="add"
          type="button"
          onClick={() => {
            setMode("create");
            setEditingServiceId(null);
            setForm({
              categoryId: categoryOptions[0]?.id ?? "",
              name: "",
              durationMin: 60,
              price: "",
              description: "",
              imageUrl: "",
              isActive: true,
            });
            setIsUpsertOpen(true);
          }}
        >
          Add Service
        </AppButton>
      </div>

      <AppModal
        open={isUpsertOpen}
        title={mode === "create" ? "Add Service" : "Edit Service"}
        description={
          mode === "create"
            ? "Create a new service in your catalog."
            : "Update service details."
        }
        onClose={() => {
          if (
            createServiceMutation.isPending ||
            fetchServiceDetailMutation.isPending ||
            updateServiceMutation.isPending
          )
            return;
          setIsUpsertOpen(false);
          setEditingServiceId(null);
        }}
        footer={
          <>
            <AppButton
              variant="ghost"
              size="md"
              type="button"
              onClick={() => {
                setIsUpsertOpen(false);
                setEditingServiceId(null);
              }}
              disabled={
                createServiceMutation.isPending ||
                fetchServiceDetailMutation.isPending ||
                updateServiceMutation.isPending
              }
            >
              Cancel
            </AppButton>
            <AppButton
              variant="primary"
              size="md"
              type="button"
              loading={
                mode === "create"
                  ? createServiceMutation.isPending
                  : updateServiceMutation.isPending
              }
              onClick={() => {
                if (!form.categoryId) {
                  alert("Please select a category.");
                  return;
                }
                if (!form.name.trim()) {
                  alert("Service name is required.");
                  return;
                }
                if (!form.price.trim()) {
                  alert("Price is required.");
                  return;
                }

                const payload = {
                  categoryId: form.categoryId,
                  name: form.name.trim(),
                  durationMin: Number(form.durationMin) || 0,
                  price: form.price.trim(),
                  description: form.description.trim() || null,
                  imageUrl: form.imageUrl.trim() || null,
                  isActive: form.isActive,
                };

                if (mode === "create") {
                  createServiceMutation.mutate(payload);
                  return;
                }
                if (!editingServiceId) return;

                updateServiceMutation.mutate({
                  serviceId: editingServiceId,
                  payload,
                });
              }}
              disabled={fetchServiceDetailMutation.isPending}
            >
              {mode === "create" ? "Create" : "Save"}
            </AppButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
              Category
            </label>
            <select
              className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={form.categoryId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              disabled={categoryLoading || fetchServiceDetailMutation.isPending}
            >
              <option value="">Select category</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.isActive === false ? " (inactive)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
              Name
            </label>
            <input
              className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Swedish Massage"
              disabled={fetchServiceDetailMutation.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
              Duration (min)
            </label>
            <input
              type="number"
              min={1}
              className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={form.durationMin}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  durationMin: Number(e.target.value),
                }))
              }
              disabled={fetchServiceDetailMutation.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
              Price
            </label>
            <input
              inputMode="decimal"
              className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder='e.g. "99.99"'
              disabled={fetchServiceDetailMutation.isPending}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
              Image URL (optional)
            </label>
            <input
              className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              placeholder="https://..."
              disabled={fetchServiceDetailMutation.isPending}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
              Description (optional)
            </label>
            <textarea
              className="w-full min-h-[92px] rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Short description..."
              disabled={fetchServiceDetailMutation.isPending}
            />
          </div>

          <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              disabled={fetchServiceDetailMutation.isPending}
            />
            Active
          </label>
        </div>
      </AppModal>

      <AppConfirmModal
        open={isDeleteOpen}
        title="Delete service?"
        description={
          deletingService
            ? `This will permanently delete "${deletingService.name}".`
            : "This will permanently delete this service."
        }
        confirmText="Yes, delete"
        cancelText="Cancel"
        confirmIcon="delete"
        isConfirmLoading={deleteServiceMutation.isPending}
        onClose={() => {
          if (deleteServiceMutation.isPending) return;
          setIsDeleteOpen(false);
          setDeletingService(null);
        }}
        onConfirm={() => {
          if (!deletingService) return;
          deleteServiceMutation.mutate(deletingService.id);
        }}
      />

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-outline-variant/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Name
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Category
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Duration
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Price
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">
                Status
              </th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {isLoading && <TableSkeletonRows columns={6} rows={6} />}
            {isError && !isLoading && (
              <tr>
                <td
                  className="px-6 py-10 text-center text-sm text-on-surface-variant/60"
                  colSpan={6}
                >
                  Failed to load.
                </td>
              </tr>
            )}
            {!isLoading && !isError && rows.length === 0 && (
              <tr>
                <td
                  className="px-6 py-10 text-center text-sm text-on-surface-variant/60"
                  colSpan={6}
                >
                  No services found.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-surface-container-low/40 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-on-surface">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {categoryNameById[row.categoryId] || row.categoryName || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {row.durationMin ? `${row.durationMin} min` : "-"}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {row.price ?? "-"}
                </td>
                <td className="px-6 py-4">
                  {row.isActive === false ? (
                    <StatusPill label="Inactive" variant="muted" />
                  ) : (
                    <StatusPill label="Active" variant="ok" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                      aria-label="Edit"
                      onClick={() => {
                        setMode("edit");
                        setEditingServiceId(row.id);
                        setIsUpsertOpen(true);
                        fetchServiceDetailMutation.mutate(row.id);
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
                        setDeletingService({ id: row.id, name: row.name });
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
