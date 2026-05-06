import React from "react";
import { useAdminChartSection } from "../hooks/useAdminChartSection";
import { useAdminStats } from "../hooks/useAdminStats";
import { formatCurrency } from "../hooks/useAdminAppointments";

const AdminChartSection: React.FC = () => {
  const { months, weeklyGoal } = useAdminChartSection();
  const { invoiceStats, isLoading: statsLoading } = useAdminStats();

  const overlayClasses = [
    "bg-surface-dim/30",
    "bg-tertiary-container/30",
    "bg-tertiary-container/50",
    "bg-tertiary-container/70",
    "bg-tertiary",
    "bg-tertiary/80",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Chart Card */}
      <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-outline-variant/30 text-left">
        <div className="flex justify-between items-center mb-10">
          <h4 className="text-lg font-headline font-semibold text-primary">Member Tier Distribution</h4>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-surface-dim"></span>
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant/60">Silver</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-tertiary-container"></span>
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant/60">Gold</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-tertiary"></span>
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant/60">VIP</span>
            </div>
          </div>
        </div>

        {/* Visual Chart Representation (CSS Bars) */}
        <div className="flex items-end justify-between h-48 gap-8 px-4">
                  {months.map((month, index) => (
                    <div key={month.label} className="flex-1 flex flex-col items-center gap-3">
                      <div
                        className="w-full bg-surface-container-low rounded-t-2xl relative"
                        style={{ height: `${month.heightPercent}%` }}
                      >
                        <div
                          className={`absolute inset-0 ${overlayClasses[index] ?? "bg-surface-dim/30"} rounded-t-2xl`}
                        ></div>
                      </div>
                      <span className="text-[10px] font-label text-on-surface-variant/40">{month.label}</span>
                    </div>
                  ))}
        </div>

        {/* Revenue Stats Row */}
        <div className="mt-10 pt-6 border-t border-outline-variant/20 grid grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 mb-1">Total Revenue</p>
            <p className="text-lg font-headline font-bold text-primary">
              {statsLoading ? "-" : formatCurrency(invoiceStats.totalRevenue, invoiceStats.currency)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 mb-1">Collected</p>
            <p className="text-lg font-headline font-bold text-emerald-600">
              {statsLoading ? "-" : formatCurrency(invoiceStats.paidRevenue, invoiceStats.currency)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 mb-1">Pending</p>
            <p className="text-lg font-headline font-bold text-amber-600">
              {statsLoading ? "-" : formatCurrency(invoiceStats.pendingRevenue, invoiceStats.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Boutique Detail Section */}
      <div className="bg-tertiary-fixed-dim/20 rounded-[2rem] p-8 border border-tertiary-fixed-dim/30 flex flex-col justify-center text-center">
        <span className="material-symbols-outlined text-tertiary text-5xl mb-6">spa</span>
        <h4 className="text-xl font-headline font-semibold text-tertiary mb-4">The Sanctuary Promise</h4>
        <p className="text-sm text-tertiary/80 leading-relaxed opacity-80 mb-8">
          &quot;Luxury is not a status, but a feeling of absolute presence and intentional space.&quot;
        </p>
        <div className="pt-6 border-t border-tertiary-fixed-dim/40">
          <p className="text-[10px] font-label uppercase tracking-widest text-tertiary">Weekly Goal Progress</p>
          <div className="mt-4 w-full h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-tertiary rounded-full"
              style={{ width: `${weeklyGoal.percent}%` }}
            ></div>
          </div>
          <p className="mt-2 text-lg font-headline font-bold text-tertiary">{weeklyGoal.percent}%</p>
        </div>
      </div>
    </div>
  );
};

export default AdminChartSection;
