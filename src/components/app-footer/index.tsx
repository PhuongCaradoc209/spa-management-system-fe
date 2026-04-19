import React from "react";

const AppFooter: React.FC = () => {
  return (
    <footer className="bg-surface-container-low w-full rounded-t-[3rem] mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 items-center md:items-start mb-8 md:mb-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">spa</span>
            <span className="text-lg font-headline font-bold text-primary">The Sanctuary</span>
          </div>
          <p className="font-body text-xs text-on-surface-variant uppercase tracking-widest">
            © 2024 The Sanctuary Ethos. Designed for tranquility.
          </p>
        </div>
        
        <div className="flex gap-12">
          <a className="font-label text-sm tracking-wide uppercase text-on-surface-variant hover:text-tertiary transition-colors duration-300" href="#">
            Services
          </a>
          <a className="font-label text-sm tracking-wide uppercase text-on-surface-variant hover:text-tertiary transition-colors duration-300" href="#">
            About
          </a>
          <a className="font-label text-sm tracking-wide uppercase text-on-surface-variant hover:text-tertiary transition-colors duration-300" href="#">
            Gallery
          </a>
          <a className="font-label text-sm tracking-wide uppercase text-on-surface-variant hover:text-tertiary transition-colors duration-300" href="#">
            Privacy
          </a>
        </div>
        
        <div className="flex gap-6 mt-8 md:mt-0">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
            share
          </span>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
            mail
          </span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
