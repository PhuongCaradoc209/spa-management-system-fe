import React from "react";

const AdminChartSection: React.FC = () => {
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
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-full bg-surface-container-low rounded-t-2xl relative" style={{ height: "45%" }}>
              <div className="absolute inset-0 bg-surface-dim/30 rounded-t-2xl"></div>
            </div>
            <span className="text-[10px] font-label text-on-surface-variant/40">JAN</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-full bg-surface-container-low rounded-t-2xl relative" style={{ height: "60%" }}>
              <div className="absolute inset-0 bg-tertiary-container/30 rounded-t-2xl"></div>
            </div>
            <span className="text-[10px] font-label text-on-surface-variant/40">FEB</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-full bg-surface-container-low rounded-t-2xl relative" style={{ height: "75%" }}>
              <div className="absolute inset-0 bg-tertiary-container/50 rounded-t-2xl"></div>
            </div>
            <span className="text-[10px] font-label text-on-surface-variant/40">MAR</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-full bg-surface-container-low rounded-t-2xl relative" style={{ height: "55%" }}>
              <div className="absolute inset-0 bg-tertiary-container/70 rounded-t-2xl"></div>
            </div>
            <span className="text-[10px] font-label text-on-surface-variant/40">APR</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-full bg-surface-container-low rounded-t-2xl relative" style={{ height: "90%" }}>
              <div className="absolute inset-0 bg-tertiary rounded-t-2xl"></div>
            </div>
            <span className="text-[10px] font-label text-on-surface-variant/40">MAY</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-full bg-surface-container-low rounded-t-2xl relative" style={{ height: "70%" }}>
              <div className="absolute inset-0 bg-tertiary/80 rounded-t-2xl"></div>
            </div>
            <span className="text-[10px] font-label text-on-surface-variant/40">JUN</span>
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
            <div className="h-full bg-tertiary rounded-full" style={{ width: "68%" }}></div>
          </div>
          <p className="mt-2 text-lg font-headline font-bold text-tertiary">68%</p>
        </div>
      </div>
    </div>
  );
};

export default AdminChartSection;
