import React, { useEffect } from "react";

type ModalSize = "sm" | "md" | "lg";

export type AppModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  size?: ModalSize;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const AppModal: React.FC<AppModalProps> = ({
  open,
  title,
  description,
  size = "md",
  onClose,
  children,
  footer,
}) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Dialog"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${SIZE_CLASS[size]} overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-outline-variant/30`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-8 pt-7">
          <div className="min-w-0">
            {title && (
              <h3 className="text-xl font-headline font-semibold text-primary">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-on-surface-variant">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-8 py-6">{children}</div>

        {footer && (
          <div className="px-8 pb-7 pt-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppModal;
