import React from "react";
import { useAdminChartSection } from "../hooks/useAdminChartSection";
import { useAdminStats } from "../hooks/useAdminStats";
import { formatCurrency } from "../hooks/useAdminAppointments";
import { useAdminDashboardMappings } from "../hooks/useAdminDashboardMappings";

const AdminChartSection: React.FC = () => {
  const { weeklyGoal } = useAdminChartSection();
  const { invoiceStats, isLoading: statsLoading } = useAdminStats();
  // Load all customers and their loyalty info
  const { customers, usersLoading, loyaltyByCustomerId, loyaltyLoading } =
    useAdminDashboardMappings();

  const tierStyles: Record<string, { dot: string; color: string }> = {
    BRONZE: { dot: "bg-amber-700", color: "#b45309" },
    SILVER: { dot: "bg-surface-dim", color: "#9ca3af" },
    GOLD: { dot: "bg-tertiary-container", color: "#d8b56d" },
    VIP: { dot: "bg-tertiary", color: "#7c3aed" },
  };

  // Show customer loyalty info (all customers)
  const allCustomers = customers || [];
  const showLoyaltySkeleton = usersLoading || loyaltyLoading;
  const tiers = ["BRONZE", "SILVER", "GOLD", "VIP"];
  const customerLoyaltyRows = allCustomers.map((customer) => {
    const lookupId = customer.customerId ?? customer.userId;
    const loyalty = lookupId ? loyaltyByCustomerId[lookupId] : undefined;
    const fullName = [customer.firstName, customer.lastName]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(" ");
    const name = fullName || customer.name?.trim() || "-";

    return {
      id: lookupId ?? name,
      name,
      tier: loyalty?.tier?.toUpperCase() ?? "-",
      score: loyalty?.score ?? 0,
      lifetimeScore: loyalty?.lifetimeScore ?? 0,
      hasCustomerProfile: Boolean(customer.customerId),
      hasLoyalty: Boolean(loyalty),
    };
  });
  const chartRows = customerLoyaltyRows.filter((customer) => customer.hasLoyalty);
  const chartWidth = 640;
  const chartHeight = 220;
  const chartPadding = { top: 24, right: 28, bottom: 48, left: 44 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const maxChartScore = Math.max(
    1,
    ...chartRows.map((customer) =>
      Math.max(customer.score, customer.lifetimeScore),
    ),
  );
  const getPoint = (value: number, index: number) => {
    const x =
      chartPadding.left +
      (chartRows.length <= 1
        ? plotWidth / 2
        : (index / (chartRows.length - 1)) * plotWidth);
    const y =
      chartPadding.top + plotHeight - (value / maxChartScore) * plotHeight;

    return { x, y };
  };
  const scoreLine = chartRows
    .map((customer, index) => {
      const point = getPoint(customer.score, index);
      return `${point.x},${point.y}`;
    })
    .join(" ");
  const lifetimeScoreLine = chartRows
    .map((customer, index) => {
      const point = getPoint(customer.lifetimeScore, index);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Chart Card */}
      <div className="lg:col-span-2 bg-white rounded-4xl p-8 border border-outline-variant/30 text-left">
        <div className="flex justify-between items-center mb-10">
          <h4 className="text-lg font-headline font-semibold text-primary">
            Customer Loyalty Scores
          </h4>
          <div className="flex flex-wrap justify-end gap-4">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-5 rounded-full bg-primary"></span>
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant/60">
                Score
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-5 rounded-full bg-tertiary"></span>
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant/60">
                Lifetime
              </span>
            </div>
            {tiers.map((tier) => (
              <div key={tier} className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${tierStyles[tier].dot}`}
                ></span>
                <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant/60">
                  {tier}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-64 overflow-x-auto">
          {showLoyaltySkeleton && (
            <div className="h-full rounded-2xl bg-surface-container-low animate-pulse"></div>
          )}
          {!showLoyaltySkeleton && chartRows.length === 0 && (
            <div className="flex h-full items-center justify-center rounded-2xl bg-surface-container-low text-sm text-on-surface-variant/60">
              No loyalty data found.
            </div>
          )}
          {!showLoyaltySkeleton && chartRows.length > 0 && (
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-full min-w-[640px] w-full"
              role="img"
              aria-label="Customer loyalty score line chart"
            >
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = chartPadding.top + plotHeight - ratio * plotHeight;
                const value = Math.round(maxChartScore * ratio);

                return (
                  <g key={ratio}>
                    <line
                      x1={chartPadding.left}
                      y1={y}
                      x2={chartWidth - chartPadding.right}
                      y2={y}
                      stroke="#ece7df"
                      strokeWidth="1"
                    />
                    <text
                      x={chartPadding.left - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-on-surface-variant/50 text-[10px]"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}

              <polyline
                points={lifetimeScoreLine}
                fill="none"
                stroke="#7c3aed"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.45"
              />
              <polyline
                points={scoreLine}
                fill="none"
                stroke="#1f2937"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartRows.map((customer, index) => {
                const scorePoint = getPoint(customer.score, index);
                const lifetimePoint = getPoint(customer.lifetimeScore, index);
                const tierColor =
                  tierStyles[customer.tier]?.color ?? "#9ca3af";
                const label =
                  customer.name.length > 10
                    ? `${customer.name.slice(0, 10)}...`
                    : customer.name;

                return (
                  <g key={customer.id}>
                    <line
                      x1={scorePoint.x}
                      y1={chartPadding.top}
                      x2={scorePoint.x}
                      y2={chartPadding.top + plotHeight}
                      stroke="#f4efe8"
                      strokeWidth="1"
                    />
                    <circle
                      cx={lifetimePoint.x}
                      cy={lifetimePoint.y}
                      r="4"
                      fill="#7c3aed"
                      opacity="0.45"
                    />
                    <circle
                      cx={scorePoint.x}
                      cy={scorePoint.y}
                      r="5"
                      fill={tierColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                    >
                      <title>
                        {customer.name} | Tier: {customer.tier} | Score:{" "}
                        {customer.score} | Lifetime: {customer.lifetimeScore}
                      </title>
                    </circle>
                    <text
                      x={scorePoint.x}
                      y={chartHeight - 18}
                      textAnchor="middle"
                      className="fill-on-surface-variant/60 text-[10px]"
                    >
                      {label}
                    </text>
                    <text
                      x={scorePoint.x}
                      y={chartHeight - 5}
                      textAnchor="middle"
                      className="fill-on-surface-variant/40 text-[9px]"
                    >
                      {customer.tier}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Revenue Stats Row */}
        <div className="mt-10 pt-6 border-t border-outline-variant/20 grid grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Total Revenue
            </p>
            <p className="text-lg font-headline font-bold text-primary">
              {statsLoading
                ? "-"
                : formatCurrency(
                    invoiceStats.totalRevenue,
                    invoiceStats.currency,
                  )}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Collected
            </p>
            <p className="text-lg font-headline font-bold text-emerald-600">
              {statsLoading
                ? "-"
                : formatCurrency(
                    invoiceStats.paidRevenue,
                    invoiceStats.currency,
                  )}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 mb-1">
              Pending
            </p>
            <p className="text-lg font-headline font-bold text-amber-600">
              {statsLoading
                ? "-"
                : formatCurrency(
                    invoiceStats.pendingRevenue,
                    invoiceStats.currency,
                  )}
            </p>
          </div>
        </div>
      </div>

      {/* Boutique Detail Section + Customer Loyalty */}
      <div className="bg-tertiary-fixed-dim/20 rounded-4xl p-8 border border-tertiary-fixed-dim/30 flex flex-col justify-center text-center">
        <span className="material-symbols-outlined text-tertiary text-5xl mb-6">
          spa
        </span>
        <h4 className="text-xl font-headline font-semibold text-tertiary mb-4">
          The Sanctuary Promise
        </h4>
        <p className="text-sm text-tertiary/80 leading-relaxed opacity-80 mb-8">
          &quot;Luxury is not a status, but a feeling of absolute presence and
          intentional space.&quot;
        </p>
        <div className="pt-6 border-t border-tertiary-fixed-dim/40 mb-6">
          <p className="text-[10px] font-label uppercase tracking-widest text-tertiary">
            Weekly Goal Progress
          </p>
          <div className="mt-4 w-full h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-tertiary rounded-full"
              style={{ width: `${weeklyGoal.percent}%` }}
            ></div>
          </div>
          <p className="mt-2 text-lg font-headline font-bold text-tertiary">
            {weeklyGoal.percent}%
          </p>
        </div>
        {/* Show customer loyalty info */}
        <div className="min-h-0">
          <h5 className="text-sm font-semibold mb-3 text-tertiary">
            Customer Loyalty
          </h5>
          {showLoyaltySkeleton && (
            <div className="space-y-2">
              <div className="h-4 bg-white/60 rounded-full animate-pulse"></div>
              <div className="h-4 bg-white/60 rounded-full animate-pulse"></div>
              <div className="h-4 bg-white/60 rounded-full animate-pulse"></div>
            </div>
          )}
          {!showLoyaltySkeleton && customerLoyaltyRows.length === 0 && (
            <p className="text-xs text-tertiary/70">No customers found.</p>
          )}
          {!showLoyaltySkeleton && customerLoyaltyRows.length > 0 && (
            <div className="max-h-56 overflow-y-auto pr-1 space-y-2 text-left">
              {customerLoyaltyRows.map((customer) => {
                const missingText = !customer.hasCustomerProfile
                  ? "No customer profile"
                  : "No loyalty data";

                return (
                  <div
                    key={customer.id}
                    className="rounded-xl bg-white/65 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-sm font-bold text-tertiary">
                        {customer.name}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-label uppercase tracking-wider text-white ${
                          tierStyles[customer.tier]?.dot ?? "bg-tertiary/40"
                        }`}
                      >
                        {customer.tier}
                      </span>
                    </div>
                    {customer.hasLoyalty ? (
                      <p className="mt-1 text-xs text-tertiary/75">
                        Score: {customer.score} | Lifetime:{" "}
                        {customer.lifetimeScore}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-tertiary/60">
                        {missingText}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChartSection;
