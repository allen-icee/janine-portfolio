import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

type FieldProps = {
  label: string
  children: ReactNode
  hint?: string
}

export function Field({ label, children, hint }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#3c232c]/75">
      <span>{label}</span>
      {children}
      {hint && <span className="text-xs font-medium text-[#3c232c]/50">{hint}</span>}
    </label>
  )
}

const controlClass =
  'w-full rounded-xl border border-[#efdad0] bg-white/70 px-4 py-3 text-sm text-[#3c232c] outline-none transition focus:border-[#ad6a6c] focus:bg-white focus:ring-2 focus:ring-[#ad6a6c]/15 disabled:cursor-not-allowed disabled:opacity-60'

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(controlClass, className)} />
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx(controlClass, 'min-h-28 resize-y', className)} />
}

export function SelectInput({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={clsx(controlClass, className)} />
}

export function AdminButton({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}) {
  const variants = {
    primary: 'border-transparent bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] text-white shadow-md hover:opacity-90',
    secondary: 'border-[#efdad0] bg-white/70 text-[#3c232c] hover:border-[#ad6a6c] hover:bg-white',
    danger: 'border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100',
    ghost: 'border-transparent bg-transparent text-[#3c232c]/70 hover:bg-white/60 hover:text-[#3c232c]',
  }

  return (
    <button
      {...props}
      className={clsx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55',
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}

export function SaveButton({ children = 'Save', disabled }: { children?: ReactNode; disabled?: boolean }) {
  return (
    <AdminButton type="submit" disabled={disabled}>
      {children}
    </AdminButton>
  )
}

export function DeleteButton({ onClick, children = 'Delete' }: { onClick: () => void; children?: ReactNode }) {
  return (
    <AdminButton type="button" onClick={onClick} variant="danger">
      {children}
    </AdminButton>
  )
}
