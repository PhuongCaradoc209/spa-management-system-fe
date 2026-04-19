import React from "react";
import AppButton from "@/components/common/AppButton";

const AdminHistoryTable: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-4">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-fixed focus:bg-white transition-all outline-none" 
            placeholder="Search customer or service..." 
            type="text"
          />
        </div>
        <div className="flex gap-4 items-center overflow-x-auto no-scrollbar w-full md:w-auto">
          <AppButton variant="outline" size="sm" iconLeft="tune" className="bg-white">
            Filter
          </AppButton>
          <AppButton variant="outline" size="sm" iconLeft="calendar_today" className="bg-white">
            Today
          </AppButton>
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-outline-variant/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Customer</th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Service Type</th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Staff</th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Date & Time</th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Price</th>
              <th className="px-6 py-5 text-[10px] font-label tracking-[0.15em] text-on-surface-variant/40 uppercase">Status</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {/* Row 1 */}
            <tr className="hover:bg-surface-container-lowest transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img 
                      alt="Linh" 
                      className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfH__yAt2WdbNvMQAnP_pexZErHv7XmP0gRM-ed0IM_vTQsaA0jc_8kV4ITSbcsx1Q84i9HzKZxwgVqaI_LW9q_4SECqMxtQL1_Z6M_HqhRnes6TpL3PFrCdFNPm5Yoh1sK59BFFJYt94sbmLOSG8pD57LUY1_LHYFfLKyGI3Dd59kJry5SWwcEwee03UAlOL_2n_sKTViJ52AC6NTbP4U6LnG3BSU4o4JHpnT3S9SX1Fhtt7ZFtQ2EAPsIbVlokmeV24OHbFNIE4"
                    />
                  </div>
                  <span className="font-medium text-on-surface">Linh Nguyễn</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-sm text-on-surface-variant">Deep Tissue Massage</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">Thao Vo</td>
              <td className="px-6 py-4">
                <div className="text-sm text-on-surface">Nov 24, 2024</div>
                <div className="text-[10px] text-on-surface-variant/40 uppercase tracking-wider">14:00 PM</div>
              </td>
              <td className="px-6 py-4 font-medium text-primary">$85.00</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-primary-container/20 text-primary text-[10px] font-bold uppercase tracking-wider">Completed</span>
              </td>
              <td className="px-6 py-4 text-right">
                <AppButton variant="ghost" size="sm" iconLeft="more_horiz" className="p-2 min-w-0" />
              </td>
            </tr>
            {/* Row 2 */}
            <tr className="hover:bg-surface-container-lowest transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img 
                      alt="Minh" 
                      className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWPH3GexWFb3xqY5YV1NY0tA1GCF1wlCbGYlB0dQ9_znYtlvJD1M4f1OmTcc3hewstIggJvKgm6hjzQs2dc1I9OPpSH2rIB-EDIcAZxhWnHW_qP_qqbveWwbQHJvPF0qM7KyW2Ro6Dg_orQ6rUL__7iWFoZil1ZmoIFEnt2mXI5iYlvX1navn0CumyTPk4rj3w81Js5HA2P7Bh1WOPkbuHlgwuJlvugK6KYmEX8VVfIwfP0_vtQ6WJiiR5jphQa1m5WZiFhHLovts"
                    />
                  </div>
                  <span className="font-medium text-on-surface">Minh Trần</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="text-sm text-on-surface-variant">HydraFacial</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">Alex Dang</td>
              <td className="px-6 py-4">
                <div className="text-sm text-on-surface">Nov 24, 2024</div>
                <div className="text-[10px] text-on-surface-variant/40 uppercase tracking-wider">15:30 PM</div>
              </td>
              <td className="px-6 py-4 font-medium text-primary">$120.00</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-secondary text-[10px] font-bold uppercase tracking-wider">In Progress</span>
              </td>
              <td className="px-6 py-4 text-right">
                <AppButton variant="ghost" size="sm" iconLeft="more_horiz" className="p-2 min-w-0" />
              </td>
            </tr>
            {/* Row 3 */}
            <tr className="hover:bg-surface-container-lowest transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img 
                      alt="Hanh" 
                      className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq_A9OZYcxW_B8p2ZLUXyxC6I5qYXw2WQCybbpgXK3HkoQe5RsvAfhasm6h9pKJIvrWgjWwwke5RpQ2_y8JeGmBgm9gSwKmvYOmNId6PSoCNs0V8saAHXKPoW1ad2tFjvoTd8r6zmr1zCE8aQ9z4fiYpTnrvFbLjqVS1fZveiVlDUdGsSVN-Eurc0HQS9E7WwS1SnWgHO7EBBAlKN_yL0ug2j3FHkGxbrRMByFgLXySd2YOoyq0fYwu8SfNN2NImpqaj3_i1BGXEA"
                    />
                  </div>
                  <span className="font-medium text-on-surface">Hạnh Phan</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span className="text-sm text-on-surface-variant">Aromatherapy Ritual</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">Thao Vo</td>
              <td className="px-6 py-4">
                <div className="text-sm text-on-surface">Nov 24, 2024</div>
                <div className="text-[10px] text-on-surface-variant/40 uppercase tracking-wider">17:00 PM</div>
              </td>
              <td className="px-6 py-4 font-medium text-primary">$95.00</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant/60 text-[10px] font-bold uppercase tracking-wider">Scheduled</span>
              </td>
              <td className="px-6 py-4 text-right">
                <AppButton variant="ghost" size="sm" iconLeft="more_horiz" className="p-2 min-w-0" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center px-4 py-2">
        <p className="text-xs text-on-surface-variant/40 uppercase tracking-widest font-label">Showing 3 of 42 records</p>
        <div className="flex gap-2">
          <AppButton variant="outline" size="sm" iconLeft="chevron_left" className="p-2 min-w-0" />
          <AppButton variant="outline" size="sm" iconLeft="chevron_right" className="p-2 min-w-0" />
        </div>
      </div>
    </div>
  );
};

export default AdminHistoryTable;
