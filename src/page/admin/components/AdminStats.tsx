import React from "react";
import { useAdminStats } from "../hooks/useAdminStats";

const AdminStats: React.FC = () => {
  const { stats, isLoading } = useAdminStats();

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      {/* Metric Card 1 */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 group hover:shadow-md transition-all duration-500">
        <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4">
          <span className="material-symbols-outlined">token</span>
        </div>
        <p className="text-[10px] font-label tracking-widest text-on-surface-variant/60 uppercase mb-1">Total Points Issued</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-headline font-bold text-on-surface text-left">
            {isLoading ? "-" : formatNumber(stats.totalPointsIssued)}
          </h3>
          <span className="text-xs text-emerald-600">+{stats.percentChange}%</span>
        </div>
      </div>

      {/* Metric Card 2 */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 group hover:shadow-md transition-all duration-500">
        <div className="w-10 h-10 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary mb-4">
          <span className="material-symbols-outlined">groups</span>
        </div>
        <p className="text-[10px] font-label tracking-widest text-on-surface-variant/60 uppercase mb-1">Active Loyalty Members</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-headline font-bold text-on-surface text-left">
            {isLoading ? "-" : stats.activeMembers.toLocaleString()}
          </h3>
          <span className="text-xs text-emerald-600">+4%</span>
        </div>
      </div>

      {/* Metric Card 3 */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 group hover:shadow-md transition-all duration-500">
        <div className="w-10 h-10 rounded-2xl bg-tertiary/5 flex items-center justify-center text-tertiary mb-4">
          <span className="material-symbols-outlined">redeem</span>
        </div>
        <p className="text-[10px] font-label tracking-widest text-on-surface-variant/60 uppercase mb-1">Points Redeemed</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-headline font-bold text-on-surface text-left">
            {isLoading ? "-" : formatNumber(stats.pointsRedeemed)}
          </h3>
          <span className="text-xs text-on-surface-variant/60 uppercase tracking-tighter">stable</span>
        </div>
      </div>

      {/* Metric Card 4 with Graphic */}
      <div className="bg-primary p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between text-left">
        <div className="relative z-10">
          <p className="text-[10px] font-label tracking-widest text-primary-fixed/60 uppercase mb-1">New Enrollments</p>
          <h3 className="text-3xl font-headline font-bold text-white">
            {isLoading ? "-" : stats.newEnrollmentsThisWeek}
          </h3>
          <p className="text-[10px] text-primary-fixed mt-2 font-medium">This Week</p>
        </div>
        <div className="absolute -right-2 -bottom-4 w-28 h-28 opacity-40 mix-blend-screen pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute bottom-4 w-12 h-4 bg-tertiary-fixed-dim rounded-full shadow-inner opacity-80"></div>
            <div className="absolute bottom-6 w-12 h-4 bg-tertiary-fixed rounded-full shadow-inner opacity-90"></div>
            <div className="absolute bottom-8 w-12 h-4 bg-tertiary-container rounded-full shadow-inner"></div>
            <span className="material-symbols-outlined absolute bottom-10 text-primary-container text-4xl">eco</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
