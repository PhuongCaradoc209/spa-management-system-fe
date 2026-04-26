import { Outlet } from "react-router-dom";
import CustomerHeader from "@/components/customer-header";
import CustomerFooter from "@/components/customer-footer";

const CustomerLayout = () => {
  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex flex-col">
      <CustomerHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
};

export default CustomerLayout;
