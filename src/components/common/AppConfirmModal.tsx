import React from "react";
import AppButton from "@/components/common/AppButton";
import AppModal from "@/components/common/AppModal";

export type AppConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmIcon?: string;
  isConfirmLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const AppConfirmModal: React.FC<AppConfirmModalProps> = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmIcon,
  isConfirmLoading,
  onConfirm,
  onClose,
}) => {
  return (
    <AppModal
      open={open}
      title={title}
      description={description}
      onClose={() => {
        if (isConfirmLoading) return;
        onClose();
      }}
      footer={
        <>
          <AppButton
            variant="ghost"
            size="md"
            type="button"
            onClick={onClose}
            disabled={isConfirmLoading}
          >
            {cancelText}
          </AppButton>
          <AppButton
            variant="primary"
            size="md"
            type="button"
            iconLeft={confirmIcon}
            loading={isConfirmLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </AppButton>
        </>
      }
    >
      <div />
    </AppModal>
  );
};

export default AppConfirmModal;
