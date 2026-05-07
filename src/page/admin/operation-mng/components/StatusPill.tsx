import React from "react";

type StatusVariant = "ok" | "muted" | "warn";

interface StatusPillProps {
  label: string;
  variant: StatusVariant;
}

export const StatusPill: React.FC<StatusPillProps> = ({ label, variant }) => {
  const classes =
    variant === "ok"
      ? "bg-primary-container/20 text-primary"
      : variant === "warn"
        ? "bg-tertiary-container/30 text-tertiary"
        : "bg-outline-variant/30 text-on-surface-variant/70";

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${classes}`}>
      {label}
    </span>
  );
};