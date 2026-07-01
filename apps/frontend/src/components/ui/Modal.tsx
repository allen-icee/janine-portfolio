// apps\frontend\src\components\ui\Modal.tsx
import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/80 px-4 backdrop-blur-xl"
      role="dialog"
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/12 bg-panel p-6 shadow-2xl"
        data-lenis-prevent
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-md border border-white/10 text-white/70 transition hover:border-cyan/60 hover:text-white"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
