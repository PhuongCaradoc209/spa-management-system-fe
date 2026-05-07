import { useState } from "react";
import { StaffTable } from "./components/StaffTable";
import { SchedulesTable } from "./components/SchedulesTable";
import { ServicesTable } from "./components/ServicesTable";
import { CategoriesTable } from "./components/CategoriesTable";

type TabKey = "staff" | "schedules" | "services" | "categories";

const TABS: { key: TabKey; label: string }[] = [
  { key: "staff", label: "Staff" },
  { key: "schedules", label: "Schedules" },
  { key: "services", label: "Services" },
  { key: "categories", label: "Categories" },
];

const AdminOperationManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("staff");

  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto w-full">
      <header className="mb-10">
        <p className="text-xs font-label tracking-[0.2em] text-tertiary uppercase mb-2">
          Management
        </p>
        <h1 className="text-4xl md:text-5xl font-headline tracking-tight text-primary leading-tight">
          Operations &amp; Management
        </h1>
        <p className="mt-3 text-base text-on-surface-variant max-w-2xl">
          Manage staff, schedules, services, and categories from one place.
        </p>
      </header>

      <div className="sticky top-24 z-20 bg-background/70 backdrop-blur-xl border-b border-outline-variant/30 mb-8">
        <div className="flex gap-8 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`pb-4 text-xs font-label tracking-[0.15em] uppercase border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "text-primary border-primary font-bold"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "staff" && <StaffTable />}
      {activeTab === "schedules" && <SchedulesTable />}
      {activeTab === "services" && <ServicesTable />}
      {activeTab === "categories" && <CategoriesTable />}
    </div>
  );
};

export default AdminOperationManagementPage;
