import React from "react";
import AdminWelcome from "./components/AdminWelcome";
import AdminStats from "./components/AdminStats";
import AdminTabs from "./components/AdminTabs";
import AdminHistoryTable from "./components/AdminHistoryTable";
import AdminChartSection from "./components/AdminChartSection";

const AdminPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto w-full">
      <AdminWelcome />
      
      <AdminTabs>
        <AdminHistoryTable />
      </AdminTabs>
      
      <AdminStats />
      
      <AdminChartSection />
    </div>
  );
};

export default AdminPage;
