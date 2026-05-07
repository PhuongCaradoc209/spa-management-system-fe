import React from "react";
import { useAdminDashboardMappings } from "../hooks/useAdminDashboardMappings";

const getCustomerName = (customer: {
  firstName?: string;
  lastName?: string;
  name?: string;
}) => {
  const fullName = [customer.firstName, customer.lastName]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");

  return fullName || customer.name?.trim() || "-";
};

const AdminLoyaltyTable: React.FC = () => {
  const { customers, usersLoading, loyaltyByCustomerId, loyaltyLoading } =
    useAdminDashboardMappings();
  const isLoading = usersLoading || loyaltyLoading;

  const rows = customers.map((customer) => {
    const lookupId = customer.customerId ?? customer.userId;
    const loyalty = lookupId ? loyaltyByCustomerId[lookupId] : undefined;

    return {
      id: lookupId,
      customerName: getCustomerName(customer),
      tier: loyalty?.tier?.toUpperCase() ?? "-",
      score: loyalty?.score ?? 0,
      lifetimeScore: loyalty?.lifetimeScore ?? 0,
      updatedAt: loyalty?.updatedAt
        ? new Date(loyalty.updatedAt).toLocaleDateString()
        : "-",
    };
  });

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        <div className="h-12 rounded-2xl bg-white/70 animate-pulse"></div>
        <div className="h-12 rounded-2xl bg-white/70 animate-pulse"></div>
        <div className="h-12 rounded-2xl bg-white/70 animate-pulse"></div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="py-20 text-center text-on-surface-variant/40 italic">
        No customers found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-outline-variant/30 bg-white">
      <table className="w-full min-w-[720px] text-left">
        <thead className="bg-surface-container-low text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          <tr>
            <th className="px-6 py-4 font-label">Customer</th>
            <th className="px-6 py-4 font-label">Tier</th>
            <th className="px-6 py-4 font-label">Score</th>
            <th className="px-6 py-4 font-label">Lifetime Score</th>
            <th className="px-6 py-4 font-label">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-surface-container-low/50">
              <td className="px-6 py-4 text-sm font-semibold text-primary">
                {row.customerName}
              </td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-tertiary-fixed-dim/40 px-3 py-1 text-[10px] font-label uppercase tracking-widest text-tertiary">
                  {row.tier}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">
                {row.score}
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">
                {row.lifetimeScore}
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant/70">
                {row.updatedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLoyaltyTable;
