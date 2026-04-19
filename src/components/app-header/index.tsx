import AppButton from "@/components/common/AppButton";
import { NAV_PATH } from "@/router/paths";
import { Link } from "react-router-dom";

const AppHeader: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-3xl shadow-[0_8px_32px_rgba(62,102,88,0.05)]">
      <nav className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
        <Link to={NAV_PATH.HOME} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-primary text-3xl">
            spa
          </span>
          <span className="text-2xl font-headline font-bold text-primary tracking-tighter">
            The Sanctuary
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-12">
          <a 
            className="text-primary font-semibold border-b-2 border-primary pb-1 hover:text-primary/70 transition-all duration-500 ease-out" 
            href="#"
          >
            Services
          </a>
          <a 
            className="text-on-surface-variant font-medium hover:text-primary transition-all duration-500 ease-out" 
            href="#"
          >
            About
          </a>
          <a 
            className="text-on-surface-variant font-medium hover:text-primary transition-all duration-500 ease-out" 
            href="#"
          >
            Gallery
          </a>
        </div>
        
        <AppButton variant="primary" size="md">
          Book Now
        </AppButton>
      </nav>
    </header>
  );
};

export default AppHeader;
