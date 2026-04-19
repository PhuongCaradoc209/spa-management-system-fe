import React from "react";

const AdminBottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface/70 backdrop-blur-xl shadow-[0_-8px_32px_rgba(62,102,88,0.08)] rounded-t-[2rem] border-t border-outline-variant/30">
      <div className="flex flex-col items-center justify-center text-on-surface-variant/40 px-6 py-2 cursor-pointer hover:text-primary transition-colors">
        <span className="material-symbols-outlined">dashboard</span>
        <span className="font-body text-[10px] tracking-widest uppercase mt-1">Overview</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-primary-container/20 text-primary rounded-2xl px-6 py-2 cursor-pointer shadow-sm">
        <span className="material-symbols-outlined font-fill">history</span>
        <span className="font-body text-[10px] tracking-widest uppercase mt-1 font-bold">Services</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant/40 px-6 py-2 cursor-pointer hover:text-primary transition-colors">
        <span className="material-symbols-outlined">stars</span>
        <span className="font-body text-[10px] tracking-widest uppercase mt-1">Loyalty</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant/40 px-6 py-2 cursor-pointer hover:text-primary transition-colors">
        <span className="material-symbols-outlined">settings</span>
        <span className="font-body text-[10px] tracking-widest uppercase mt-1">Settings</span>
      </div>
    </nav>
  );
};

export default AdminBottomNav;
