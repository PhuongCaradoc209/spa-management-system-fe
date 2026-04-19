import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "@/page/admin/components/AdminHeader";
import AdminFooter from "@/page/admin/components/AdminFooter";
import AdminBottomNav from "@/page/admin/components/AdminBottomNav";

const AdminLayout: React.FC = () => {
  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <AdminFooter />
      <AdminBottomNav />
    </div>
  );
};

export default AdminLayout;
