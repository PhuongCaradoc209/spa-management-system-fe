import React from "react";

const AdminWelcome: React.FC = () => {
  return (
    <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
      <div className="max-w-2xl text-left">
        <span className="text-xs font-label tracking-[0.2em] text-tertiary uppercase mb-2 block">Management Portal</span>
        <h2 className="text-5xl font-headline font-light tracking-tight text-primary leading-tight">
          Welcome back, <br /><span className="font-bold">Director Marcelle</span>
        </h2>
      </div>
    </div>
  );
};

export default AdminWelcome;
