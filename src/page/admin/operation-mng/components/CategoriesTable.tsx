import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  return (p.items ?? p.data ?? p.categories ?? []) as Record<string, unknown>[];
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;

type ApiErrorResponse = {
  message?: string;
};

type UpsertMode = "create" | "edit";

export const CategoriesTable: React.FC = () => {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<UpsertMode>("create");
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isActive: true,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "serviceCategories"],
    queryFn: () =>
      serviceCategoryService.listCategories({ includeInactive: "true" }),
    staleTime: 60_000,
  });

  const createCategoryMutation = useMutation({
    mutationFn: serviceCategoryService.createCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "serviceCategories"],
      });
      setIsUpsertOpen(false);
      setForm({
        name: "",
        description: "",
        imageUrl: "",
        isActive: true,
      });
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Create category failed. Please try again.");
    },
  });

  const fetchCategoryDetailMutation = useMutation({
    mutationFn: (categoryId: string) =>
      serviceCategoryService.getCategoryDetail(categoryId, {
        includeInactive: "true",
      }),
    onSuccess: (payload: unknown) => {
      const root = asRecord(payload);
      const categoryRaw = (asRecord(root?.category) ?? root) as Record<
        string,
        unknown
      > | null;
      if (!categoryRaw) return;

      setForm((prev) => ({
        ...prev,
        name: String(categoryRaw.name ?? ""),
        description: String(categoryRaw.description ?? ""),
        imageUrl: String(categoryRaw.imageUrl ?? ""),
        isActive: Boolean(categoryRaw.isActive ?? true),
      }));
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Failed to fetch category detail.");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (input: {
      categoryId: string;
      payload: Parameters<typeof serviceCategoryService.updateCategory>[1];
    }) =>
      serviceCategoryService.updateCategory(input.categoryId, input.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "serviceCategories"],
      });
      setIsUpsertOpen(false);
      setEditingCategoryId(null);
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Update category failed. Please try again.");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) =>
      serviceCategoryService.deleteCategory(categoryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "serviceCategories"],
      });
      setIsDeleteOpen(false);
      setDeletingCategory(null);
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Delete category failed. Please try again.");
    },
  });

  const rows = useMemo(
    () =>
      extractItems(data)
        .map((raw) => ({
          id: String(raw.id ?? raw.categoryId ?? raw._id ?? ""),
          name: String(raw.name ?? "-"),
          description: String(raw.description ?? ""),
          isActive: raw.isActive as boolean | undefined,
        }))
        .filter((r) => r.id),
    [data],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-headline font-semibold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">category</span>
          Categories
        </h2>
        <AppButton
          variant="primary"
          size="md"
          iconLeft="add"
          type="button"
          onClick={() => {
            setMode("create");
            setEditingCategoryId(null);
            setForm({
              name: "",
              description: "",
              imageUrl: "",
              isActive: true,
            });
            setIsUpsertOpen(true);
          }}
        >
          Add Category
        </AppButton>
      </div>

      <AppModal
        open={isUpsertOpen}
        title={mode === "create" ? "Add Category" : "Edit Category"}
        description={
          mode === "create"
            ? "Create a new service category."
            : "Update category details."
        }
        onClose={() => {
          if (
            createCategoryMutation.isPending ||
            fetchCategoryDetailMutation.isPending ||
            updateCategoryMutation.isPending
          )
            return;
          setIsUpsertOpen(false);
          setEditingCategoryId(null);
        }}
        footer={
          <>
            <AppButton
              variant="ghost"
              size="md"
              type="button"
              onClick={() => {
                setIsUpsertOpen(false);
                setEditingCategoryId(null);
              }}
              disabled={
                createCategoryMutation.isPending ||
                fetchCategoryDetailMutation.isPending ||
                updateCategoryMutation.isPending
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
                  ? createCategoryMutation.isPending
                  : updateCategoryMutation.isPending
              }
              disabled={fetchCategoryDetailMutation.isPending}
              onClick={() => {
                if (!form.name.trim()) {
                  alert("Category name is required.");
                  return;
                }
                const payload = {
                  name: form.name.trim(),
                  description: form.description.trim() || null,
                  imageUrl: form.imageUrl.trim() || null,
                  isActive: form.isActive,
                };

                if (mode === "create") {
                  createCategoryMutation.mutate(payload);
                  return;
                }
                if (!editingCategoryId) return;
                updateCategoryMutation.mutate({
                  categoryId: editingCategoryId,
                  payload,
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
              Name
            </label>
            <input
              className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Massage"
              disabled={fetchCategoryDetailMutation.isPending}
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
              disabled={fetchCategoryDetailMutation.isPending}
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
              disabled={fetchCategoryDetailMutation.isPending}
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
              disabled={fetchCategoryDetailMutation.isPending}
            />
            Active
          </label>
        </div>
      </AppModal>

      <AppConfirmModal
        open={isDeleteOpen}
        title="Delete category?"
        description={
          deletingCategory
            ? `This will permanently delete "${deletingCategory.name}". If it has services, the API will reject.`
            : "This will permanently delete this category."
        }
        confirmText="Yes, delete"
        cancelText="Cancel"
        confirmIcon="delete"
        isConfirmLoading={deleteCategoryMutation.isPending}
        onClose={() => {
          if (deleteCategoryMutation.isPending) return;
          setIsDeleteOpen(false);
          setDeletingCategory(null);
        }}
        onConfirm={() => {
          if (!deletingCategory) return;
          deleteCategoryMutation.mutate(deletingCategory.id);
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
                Description
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
            {isLoading && <TableSkeletonRows columns={4} rows={6} />}
            {isError && !isLoading && (
              <tr>
                <td
                  className="px-6 py-10 text-center text-sm text-on-surface-variant/60"
                  colSpan={4}
                >
                  Failed to load.
                </td>
              </tr>
            )}
            {!isLoading && !isError && rows.length === 0 && (
              <tr>
                <td
                  className="px-6 py-10 text-center text-sm text-on-surface-variant/60"
                  colSpan={4}
                >
                  No categories found.
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
                  {row.description || "-"}
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
                        setEditingCategoryId(row.id);
                        setIsUpsertOpen(true);
                        fetchCategoryDetailMutation.mutate(row.id);
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
                        setDeletingCategory({ id: row.id, name: row.name });
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
