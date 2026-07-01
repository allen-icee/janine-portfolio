// apps\frontend\src\components\admin\AdminModal.tsx
import type { ReactNode } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { AdminButton } from "./AdminFields";

type AdminModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  widthClassName?: string;
};

export function AdminModal({
  open,
  title,
  description,
  children,
  onClose,
  widthClassName = "max-w-2xl",
}: AdminModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-[#3c232c]/50 px-4 pb-4 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`max-h-[90svh] w-full overflow-hidden rounded-[2rem] border border-[#efdad0] bg-[#f9f6f3] shadow-2xl sm:rounded-[2.5rem] ${widthClassName}`}
          >
            <header className="flex items-center justify-between gap-4 border-b border-[#efdad0]/80 bg-white/80 px-6 py-5 backdrop-blur-md sm:px-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#3c232c] sm:text-3xl">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#ad6a6c] sm:text-[11px]">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-[#efdad0] bg-white text-[#3c232c] shadow-sm transition-all duration-300 hover:border-[#ad6a6c] hover:bg-[#ad6a6c]/10 hover:text-[#ad6a6c]"
                aria-label="Close"
              >
                <Icon icon="ph:x-bold" className="text-lg" />
              </button>
            </header>
            <div
              className="max-h-[calc(90svh-100px)] overflow-y-auto p-6 sm:p-8"
              data-lenis-prevent
            >
              {children}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AdminModal
      open={open}
      title={title}
      description={description}
      onClose={onCancel}
      widthClassName="max-w-md"
    >
      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <AdminButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </AdminButton>
        <AdminButton
          type="button"
          variant={danger ? "danger" : "primary"}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Working..." : confirmLabel}
        </AdminButton>
      </div>
    </AdminModal>
  );
}
