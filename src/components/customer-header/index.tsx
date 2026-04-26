import React from "react";
import { Link, NavLink } from "react-router-dom";
import AppButton from "@/components/common/AppButton";
import { NAV_PATH } from "@/router/paths"; // Giả sử bạn đã thêm BOOKING và THERAPIST vào đây

const AppHeader: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    const baseClass = "transition-all duration-500 ease-out pb-1";
    
    return isActive
      ? `${baseClass} text-primary font-semibold border-b-2 border-primary`
      : `${baseClass} text-on-surface-variant font-medium hover:text-primary`;
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-3xl shadow-[0_8px_32px_rgba(62,102,88,0.05)]">
      <nav className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
        <Link to={NAV_PATH.HOME} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-primary text-3xl">spa</span>
          <span className="text-2xl font-headline font-bold text-primary tracking-tighter">
            The Sanctuary
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-12">
          {/* Thay thẻ <a> bằng <NavLink> */}
          <NavLink to={NAV_PATH.BOOKING} className={navLinkClass}>
            Booking
          </NavLink>
          
          <NavLink to={NAV_PATH.THERAPIST} className={navLinkClass}>
            Therapist
          </NavLink>
        </div>
        
        <AppButton variant="primary" size="md">
          Book Now
        </AppButton>
      </nav>
    </header>
  );
};

export default AppHeader;