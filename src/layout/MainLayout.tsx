import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "@/components/app-header";
import AppFooter from "@/components/app-footer";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-body text-on-surface selection:bg-primary/20">
      <AppHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
};

export default MainLayout;
