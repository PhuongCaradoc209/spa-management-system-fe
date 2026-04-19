import React from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "outline" | "text";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: string;
  iconRight?: string;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const AppButton: React.FC<AppButtonProps> = ({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  loading,
  fullWidth,
  className = "",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-headline font-bold transition-all duration-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/10 hover:scale-[1.02]",
    secondary: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
    tertiary: "bg-tertiary text-white shadow-lg shadow-tertiary/10 hover:scale-[1.02]",
    outline: "border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary bg-transparent",
    ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-primary",
    text: "bg-transparent text-primary hover:opacity-80 p-0",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] rounded-xl tracking-widest uppercase",
    md: "px-6 py-3 text-xs rounded-full tracking-widest uppercase",
    lg: "px-8 py-4 text-sm rounded-full tracking-widest uppercase",
    xl: "px-10 py-5 text-lg rounded-full",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className} cursor-pointer`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="material-symbols-outlined animate-spin mr-2 text-[1.2rem]">
          progress_activity
        </span>
      )}
      {!loading && iconLeft && (
        <span className="material-symbols-outlined mr-2 text-[1.2rem] transition-all">
          {iconLeft}
        </span>
      )}
      {children}
      {!loading && iconRight && (
        <span className="material-symbols-outlined ml-2 text-[1.2rem] transition-all">
          {iconRight}
        </span>
      )}
    </button>
  );
};

export default AppButton;
