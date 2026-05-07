import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { StatusPill } from "./StatusPill";
import AppButton from "@/components/common/AppButton";
import AppModal from "@/components/common/AppModal";
import AppConfirmModal from "@/components/common/AppConfirmModal";
import TableSkeletonRows from "@/components/common/TableSkeletonRows";
import { isAxiosError } from "axios";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;

const pickProfile = (raw: Record<string, unknown>) =>
  asRecord(raw.staff) ?? asRecord(raw.customer);

const buildName = (raw: Record<string, unknown>) => {
  const profile = pickProfile(raw);
  const first = String(profile?.firstName ?? "");
  const last = String(profile?.lastName ?? "");
  const name = [first, last].filter(Boolean).join(" ");
  if (name) return name;

  const fallback = String(raw.email ?? raw.fullName ?? raw.name ?? "-").trim();
  return fallback || "-";
};

const extractUsers = (payload: unknown) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  const p = payload as Record<string, unknown>;
  return (p.items ?? p.data ?? p.users ?? []) as Record<string, unknown>[];
};

type ApiErrorResponse = {
  message?: string;
};

type UpsertMode = "create" | "edit";

export const StaffTable: React.FC = () => {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<UpsertMode>("create");
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "STAFF" as "ADMIN" | "STAFF",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    isAvailable: true,
    isActive: true,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => userService.listUsers(),
    staleTime: 60_000,
  });

  const createUserMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setIsUpsertOpen(false);
      setForm({
        email: "",
        password: "",
        role: "STAFF",
        firstName: "",
        lastName: "",
        phone: "",
        bio: "",
        isAvailable: true,
        isActive: true,
      });
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Create user failed. Please try again.");
    },
  });

  const fetchUserDetailMutation = useMutation({
    mutationFn: (userId: string) => userService.getUserById(userId),
    onSuccess: (payload: unknown) => {
      const root = asRecord(payload);
      const userRaw = (asRecord(root?.user) ?? root) as Record<
        string,
        unknown
      > | null;
      if (!userRaw) return;

      const profile = pickProfile(userRaw);
      const roleRaw = String(userRaw.role ?? "").toUpperCase();
      const role = roleRaw === "ADMIN" ? "ADMIN" : "STAFF";
      const isActive = Boolean(userRaw.isActive ?? true);

      setForm((prev) => ({
        ...prev,
        email: String(userRaw.email ?? ""),
        password: "",
        role,
        firstName: String(profile?.firstName ?? ""),
        lastName: String(profile?.lastName ?? ""),
        phone: String(profile?.phone ?? ""),
        bio: String(profile?.bio ?? userRaw.bio ?? ""),
        isAvailable: Boolean(
          profile?.isAvailable ?? userRaw.isAvailable ?? true,
        ),
        isActive,
      }));
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Failed to fetch user detail.");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (input: {
      userId: string;
      payload: { role: "ADMIN" | "STAFF"; isActive: boolean };
    }) => userService.updateUser(input.userId, input.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setIsUpsertOpen(false);
      setEditingUserId(null);
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Update user failed. Please try again.");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setIsDeleteOpen(false);
      setDeletingUser(null);
    },
    onError: (error: unknown) => {
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;
      alert(apiMessage || "Delete user failed. Please try again.");
    },
  });

  const rows = useMemo(
    () =>
      extractUsers(data)
        .map((raw) => ({
          id: String(raw.id ?? raw.userId ?? raw._id ?? ""),
          name: buildName(raw),
          email: String(raw.email ?? ""),
          role: String(raw.role ?? "").toUpperCase(),
          isActive: raw.isActive as boolean | undefined,
          isAvailable:
            (asRecord(raw.staff)?.isAvailable as boolean | undefined) ??
            (raw.isAvailable as boolean | undefined),
        }))
        .filter(
          (r) =>
            r.id &&
            r.role !== "CUSTOMER" &&
            (r.role === "ADMIN" ||
              r.role === "STAFF" ||
              r.role === "THERAPIST" ||
              r.role === ""),
        ),
    [data],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-headline font-semibold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">group</span>
          Team Roster
        </h2>
        <AppButton
          variant="primary"
          size="md"
          iconLeft="person_add"
          onClick={() => {
            setMode("create");
            setEditingUserId(null);
            setForm({
              email: "",
              password: "",
              role: "STAFF",
              firstName: "",
              lastName: "",
              phone: "",
              bio: "",
              isAvailable: true,
              isActive: true,
            });
            setIsUpsertOpen(true);
          }}
          type="button"
        >
          Add Staff
        </AppButton>
      </div>

      <AppModal
        open={isUpsertOpen}
        title={mode === "create" ? "Add Staff" : "Edit User"}
        description={
          mode === "create"
            ? "Create a staff/admin user."
            : "Update user role or active status."
        }
        onClose={() => {
          if (
            createUserMutation.isPending ||
            fetchUserDetailMutation.isPending ||
            updateUserMutation.isPending
          )
            return;
          setIsUpsertOpen(false);
          setEditingUserId(null);
        }}
        footer={
          <>
            <AppButton
              variant="ghost"
              size="md"
              type="button"
              onClick={() => {
                setIsUpsertOpen(false);
                setEditingUserId(null);
              }}
              disabled={
                createUserMutation.isPending ||
                fetchUserDetailMutation.isPending ||
                updateUserMutation.isPending
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
                  ? createUserMutation.isPending
                  : updateUserMutation.isPending
              }
              onClick={() => {
                if (mode === "create") {
                  if (!form.email || !form.password) {
                    alert("Email and password are required.");
                    return;
                  }

                  createUserMutation.mutate({
                    email: form.email,
                    password: form.password,
                    role: form.role,
                    firstName: form.firstName || undefined,
                    lastName: form.lastName || undefined,
                    phone: form.phone || undefined,
                    bio: form.bio || undefined,
                    isAvailable: form.isAvailable,
                  });
                  return;
                }

                if (!editingUserId) return;

                updateUserMutation.mutate({
                  userId: editingUserId,
                  payload: {
                    role: form.role,
                    isActive: form.isActive,
                  },
                });
              }}
            >
              {mode === "create" ? "Create" : "Save"}
            </AppButton>
          </>
        }
      >
        {fetchUserDetailMutation.isPending ? (
          <div className="py-12 text-center text-sm text-on-surface-variant/60">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
                Role
              </label>
              <select
                className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                value={form.role}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    role: e.target.value === "ADMIN" ? "ADMIN" : "STAFF",
                  }))
                }
              >
                <option value="STAFF">STAFF</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
                Email
              </label>
              <input
                className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="user@example.com"
                disabled={mode === "edit"}
              />
            </div>

            {mode === "create" && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
                  Password
                </label>
                <input
                  className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="••••••••"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
                First Name
              </label>
              <input
                className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                value={form.firstName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, firstName: e.target.value }))
                }
                placeholder="First name"
                disabled={mode === "edit"}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
                Last Name
              </label>
              <input
                className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                value={form.lastName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Last name"
                disabled={mode === "edit"}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
                Phone
              </label>
              <input
                className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Phone"
                disabled={mode === "edit"}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-on-surface-variant/60">
                Bio
              </label>
              <textarea
                className="w-full min-h-24 resize-y rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                value={form.bio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Short bio"
                disabled={mode === "edit"}
              />
            </div>

            <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isAvailable: e.target.checked,
                  }))
                }
                disabled={mode === "edit"}
              />
              Available
            </label>

            {mode === "edit" && (
              <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                />
                Active
              </label>
            )}
          </div>
        )}
      </AppModal>

      <AppConfirmModal
        open={isDeleteOpen}
        title="Delete user?"
        description={
          deletingUser
            ? `This will permanently delete ${deletingUser.name}.`
            : "This will permanently delete this user."
        }
        confirmText="Yes, delete"
        cancelText="Cancel"
        confirmIcon="delete"
        isConfirmLoading={deleteUserMutation.isPending}
        onClose={() => {
          if (deleteUserMutation.isPending) return;
          setIsDeleteOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={() => {
          if (!deletingUser) return;
          deleteUserMutation.mutate(deletingUser.id);
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
                Role
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
                  No staff found.
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
                  {row.role || "-"}
                </td>
                <td className="px-6 py-4">
                  {row.isActive === false ? (
                    <StatusPill label="Inactive" variant="muted" />
                  ) : row.isAvailable === false ? (
                    <StatusPill label="Unavailable" variant="warn" />
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
                        setEditingUserId(row.id);
                        setIsUpsertOpen(true);
                        fetchUserDetailMutation.mutate(row.id);
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
                        setDeletingUser({ id: row.id, name: row.name });
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
