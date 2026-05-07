import AppButton from "@/components/common/AppButton";
import { NAV_PATH } from "@/router/paths";
import { NavLink, useNavigate } from "react-router-dom";

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate(NAV_PATH.LOGIN);
      return;
    }

    navigate(NAV_PATH.LOGIN);
  };

  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-surface/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(62,102,88,0.05)] border-b border-outline-variant/30">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed overflow-hidden ring-2 ring-primary/10">
          <img
            alt="Admin Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6f1fe_NCwxFMop4truMUyfw0PDHA9a-CnF-VBdHbfohAaIqUqKMVZN0CKxpIhpYai940OkxxB_i0NucrdL3cW7COS-bsaadGb7X5ZprxmBWyFgDyr_X764_k5D2G2KJkBQR-rxVR1130btZWiAxH5F6z-zHKr_t17HqM4tD0Es2movbyDHeBEVOc10FF3uiwjgq8cjYBmEAeDm0k2Z8GH0gB-LQdF4v-VhpwbY9Fv3yKhR_RN1BvwMW0QWl7TjStBmobHcO3W_8I"
          />
        </div>
        <div>
          <p className="text-xs font-label tracking-widest uppercase text-on-surface-variant/60">
            Administrator
          </p>
          <h1 className="text-xl font-headline font-semibold tracking-widest uppercase text-primary">
            ADMINISTRATORS
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-8 items-center text-on-surface-variant/60">
          <NavLink
            to={NAV_PATH.ADMIN}
            end
            className={({ isActive }) =>
              `transition-opacity duration-500 hover:opacity-80 ${isActive ? "text-primary font-medium" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to={NAV_PATH.ADMIN_OPERATIONS}
            className={({ isActive }) =>
              `transition-opacity duration-500 hover:opacity-80 ${isActive ? "text-primary font-medium" : ""}`
            }
          >
            Operations
          </NavLink>
        </div>
        <AppButton
          variant={isLoggedIn ? "outline" : "primary"}
          size="sm"
          iconLeft={isLoggedIn ? "logout" : "login"}
          onClick={handleAuthAction}
        >
          {isLoggedIn ? "Logout" : "Login"}
        </AppButton>
      </div>
    </header>
  );
};

export default AdminHeader;
