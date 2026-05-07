import AppButton from "@/components/common/AppButton"; // Nhớ giữ lại import này
import { NAV_PATH } from "@/router/paths";
import { Link, NavLink, useNavigate } from "react-router-dom";

const AppHeader: React.FC = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate(NAV_PATH.HOME);
  };

  const handleLogin = () => {
    navigate(NAV_PATH.LOGIN);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
    const baseClasses = "transition-all duration-500 ease-out pb-1";
    const activeClasses =
      "text-primary font-semibold border-b-2 border-primary hover:text-primary/70";
    const inactiveClasses =
      "text-on-surface-variant font-medium hover:text-primary border-b-2 border-transparent";
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-3xl shadow-[0_8px_32px_rgba(62,102,88,0.05)]">
      <nav className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
        <Link
          to={NAV_PATH.HOME}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined text-primary text-3xl">
            spa
          </span>
          <span className="text-2xl font-headline font-bold text-primary tracking-tighter">
            The Sanctuary
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-12">
          <NavLink to={NAV_PATH.HOME} className={navLinkClasses}>
            About
          </NavLink>
          <NavLink to={NAV_PATH.BOOKING} className={navLinkClasses}>
            Booking
          </NavLink>
          <NavLink to={NAV_PATH.THERAPIST} className={navLinkClasses}>
            Therapist
          </NavLink>
        </div>

        {token ? (
          <AppButton variant="outline" size="md" onClick={handleLogout}>
            Logout
          </AppButton>
        ) : (
          <AppButton variant="primary" size="md" onClick={handleLogin}>
            Login
          </AppButton>
        )}
      </nav>
    </header>
  );
};

export default AppHeader;
