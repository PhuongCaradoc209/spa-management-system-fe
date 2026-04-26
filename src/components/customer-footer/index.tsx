import React from "react";

const CustomerFooter: React.FC = () => {
  return (
    <footer className="w-full flex flex-col items-center gap-6 py-6 bg-surface-container-low/30 border-t border-outline-variant/30 mt-20">
      <div className="flex gap-8">
        <a className="text-on-surface-variant/40 font-body text-xs tracking-widest uppercase hover:text-primary transition-colors duration-300" href="#">Terms</a>
        <a className="text-on-surface-variant/40 font-body text-xs tracking-widest uppercase hover:text-primary transition-colors duration-300" href="#">Privacy</a>
        <a className="text-on-surface-variant/40 font-body text-xs tracking-widest uppercase hover:text-primary transition-colors duration-300" href="#">Contact</a>
      </div>
      <p className="text-primary font-body text-xs tracking-widest uppercase opacity-60">
        © 2024 Lumière Wellness. All rights reserved.
      </p>
    </footer>
  );
};

export default CustomerFooter;
