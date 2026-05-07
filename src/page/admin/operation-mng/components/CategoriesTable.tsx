import { useQuery } from "@tanstack/react-query";
import { serviceCategoryService } from "@/services/service-category.service";
import { StatusPill } from "./StatusPill";

const extractItems = (payload: unknown) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  const p = payload as Record<string, unknown>;
  return (p.items ?? p.data ?? p.categories ?? []) as Record<string, unknown>[];
};

export const CategoriesTable: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "serviceCategories"],
    queryFn: () => serviceCategoryService.listCategories({ includeInactive: "true" }),
    staleTime: 60_000,
  });

  const rows = extractItems(data).map((raw) => ({
    id: String(raw.id ?? raw.categoryId ?? raw._id ?? ""),
    name: String(raw.name ?? "-"),
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder
      : typeof raw.sort_order === "number" ? raw.sort_order : undefined,
    isActive: raw.isActive as boolean | undefined,
  })).filter((r) => r.id);

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-headline font-semibold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">category</span>
          Categories
        </h2>
        <button className="px-4 py-2 bg-primary text-white rounded-full text-xs font-bold">Add Category</button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-outline-variant/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Name</th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Sort</th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {isLoading && <tr><td className="px-6 py-10 text-center text-sm text-on-surface-variant/60" colSpan={3}>Loading...</td></tr>}
            {isError && !isLoading && <tr><td className="px-6 py-10 text-center text-sm text-on-surface-variant/60" colSpan={3}>Failed to load.</td></tr>}
            {!isLoading && !isError && rows.length === 0 && <tr><td className="px-6 py-10 text-center text-sm text-on-surface-variant/60" colSpan={3}>No categories found.</td></tr>}
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-surface-container-low/40 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-on-surface">{row.name}</td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{row.sortOrder ?? "-"}</td>
                <td className="px-6 py-4">{row.isActive === false ? <StatusPill label="Inactive" variant="muted" /> : <StatusPill label="Active" variant="ok" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};