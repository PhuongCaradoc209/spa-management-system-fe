import React, { useState } from "react";
import AppButton from "@/components/common/AppButton";
import AdminLoyaltyTable from "./AdminLoyaltyTable";

interface AdminTabsProps {
  children?: React.ReactNode;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("history");

  return (
    <div className="bg-surface-container-low rounded-[2rem] p-4 mb-8">
      <div className="flex gap-2 mb-8 p-1 bg-surface-dim/30 w-fit rounded-full">
        <AppButton 
          variant={activeTab === "history" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("history")}
          className={activeTab === "history" ? "bg-white text-primary" : ""}
        >
          Service History
        </AppButton>
        <AppButton 
          variant={activeTab === "loyalty" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("loyalty")}
          className={activeTab === "loyalty" ? "bg-white text-primary" : ""}
        >
          Loyalty Dashboard
        </AppButton>
      </div>
      
      {activeTab === "history" && children}
      {activeTab === "loyalty" && <AdminLoyaltyTable />}
    </div>
  );
};

export default AdminTabs;
