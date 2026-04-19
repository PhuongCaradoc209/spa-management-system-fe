import React from "react";
import AppButton from "@/components/common/AppButton";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent pt-32 pb-16 px-6">
      <div className="max-w-md w-full animate-in zoom-in-95 duration-500">
        {/* Authentication Card */}
        <div className="auth-card-glass rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(62,102,88,0.1)] border border-white/20">
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-primary mb-2">
              Welcome Back
            </h1>
            <p className="text-on-surface-variant font-medium text-sm">
              Step into your digital sanctuary
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-surface-container-low rounded-full mb-8">
            <AppButton variant="secondary" className="flex-1 bg-white shadow-sm" size="sm">
              Login
            </AppButton>
            <AppButton variant="ghost" className="flex-1" size="sm">
              Register
            </AppButton>
          </div>

          {/* Login Form */}
          <form className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[0.65rem] font-bold tracking-[0.15em] uppercase text-on-surface-variant ml-4">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
                  mail
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all placeholder:text-outline-variant text-primary" 
                  placeholder="curator@serenespa.com" 
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-4">
                <label className="block text-[0.65rem] font-bold tracking-[0.15em] uppercase text-on-surface-variant">
                  Password
                </label>
                <a 
                  className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-tertiary hover:opacity-80 transition-opacity" 
                  href="#"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
                  lock
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all text-primary" 
                  placeholder="••••••••" 
                  type="password"
                />
              </div>
            </div>

            <div className="flex items-center px-4">
              <input 
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20" 
                id="remember-me" 
                name="remember-me" 
                type="checkbox"
              />
              <label className="ml-2 block text-xs text-on-surface-variant" htmlFor="remember-me">
                Remember me
              </label>
            </div>

            <div className="pt-2">
              <AppButton 
                variant="primary"
                fullWidth
                size="lg"
                type="submit"
                className="font-headline font-semibold tracking-wider text-sm shadow-lg shadow-primary/20"
              >
                Login
              </AppButton>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-on-surface-variant">
              Don&apos;t have an account? 
              <a className="font-bold text-tertiary hover:underline underline-offset-4 ml-1" href="#">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
