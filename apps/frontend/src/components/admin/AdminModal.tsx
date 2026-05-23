import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AdminButton } from './AdminFields'

type AdminModalProps = {
  open: boolean
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  widthClassName?: string
}

export function AdminModal({ open, title, description, children, onClose, widthClassName = 'max-w-3xl' }: AdminModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-[#3c232c]/45 px-3 pb-3 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`max-h-[92svh] w-full overflow-hidden rounded-[2rem] border border-[#efdad0] bg-[#f9f6f3] shadow-2xl ${widthClassName}`}
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#efdad0] bg-white/70 px-5 py-4 backdrop-blur sm:px-7">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#3c232c] sm:text-3xl">{title}</h2>
                {description && <p className="mt-1 text-sm leading-6 text-[#3c232c]/65">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-[#efdad0] bg-white text-[#3c232c] transition hover:border-[#ad6a6c] hover:text-[#ad6a6c]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </header>
            <div className="max-h-[calc(92svh-92px)] overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">{children}</div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type ConfirmModalProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AdminModal open={open} title={title} description={description} onClose={onCancel} widthClassName="max-w-md">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <AdminButton type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </AdminButton>
        <AdminButton type="button" variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Working...' : confirmLabel}
        </AdminButton>
      </div>
    </AdminModal>
  )
}
