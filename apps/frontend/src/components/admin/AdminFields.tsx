import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

type FieldProps = {
  label: string
  children: ReactNode
}

export function Field({ label, children }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink/72">
      {label}
      {children}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="rounded-md border border-coffee/15 bg-white/55 px-3 py-2 text-ink outline-none focus:border-coffee" />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="min-h-28 rounded-md border border-coffee/15 bg-white/55 px-3 py-2 text-ink outline-none focus:border-coffee" />
}

export function SaveButton({ children = 'Save' }: { children?: ReactNode }) {
  return (
    <button type="submit" className="rounded-full bg-coffee px-6 py-3 font-semibold text-white transition hover:bg-ink">
      {children}
    </button>
  )
}

export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
      Delete
    </button>
  )
}
