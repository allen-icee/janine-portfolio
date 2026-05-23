import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { AdminButton, DeleteButton, Field, SaveButton, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminModal, ConfirmModal } from '../../components/admin/AdminModal'
import { AdminShell } from '../../components/admin/AdminShell'
import { supabase } from '../../lib/supabase'

type FaqRow = {
  id?: string
  question: string
  answer: string
  sort_order: number
  is_active: boolean
}

const emptyFaq: FaqRow = {
  question: '',
  answer: '',
  sort_order: 0,
  is_active: true,
}

export function AdminFaqsPage() {
  const [items, setItems] = useState<FaqRow[]>([])
  const [form, setForm] = useState<FaqRow>(emptyFaq)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<FaqRow | null>(null)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const loadItems = async () => {
    const { data, error } = await supabase!.from('faqs').select('*').order('sort_order')
    if (error) {
      toast.error(error.message)
      return
    }
    setItems(data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const { data, error } = await supabase!.from('faqs').select('*').order('sort_order')
      if (error) {
        toast.error(error.message)
        return
      }
      setItems(data ?? [])
    }

    void loadInitialItems()
  }, [])

  const updateForm = <Key extends keyof FaqRow>(key: Key, value: FaqRow[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setIsDirty(true)
  }

  const openCreate = () => {
    setForm({ ...emptyFaq, sort_order: items.length })
    setIsDirty(false)
    setIsModalOpen(true)
  }

  const openEdit = (item: FaqRow) => {
    setForm(item)
    setIsDirty(false)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsDirty(false)
  }

  const requestCloseModal = () => {
    if (isDirty) {
      setShowDiscardConfirm(true)
      return
    }
    closeModal()
  }

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    const { error } = await supabase!.from('faqs').upsert(form)
    setIsSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success(form.id ? 'FAQ updated.' : 'FAQ created.')
    closeModal()
    await loadItems()
  }

  const deleteItem = async () => {
    if (!deleteTarget?.id) return
    setIsSaving(true)

    const { error } = await supabase!.from('faqs').delete().eq('id', deleteTarget.id)
    setIsSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('FAQ deleted.')
    setDeleteTarget(null)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="FAQs" description="Create, edit, reorder, publish, or remove frequently asked questions.">
        <div className="mb-6 flex justify-end">
          <AdminButton type="button" onClick={openCreate}>
            <Plus size={16} />
            FAQ
          </AdminButton>
        </div>

        <div className="grid gap-4">
          {items.length === 0 && (
            <div className="rounded-2xl border border-[#efdad0] bg-white/55 p-8 text-center text-[#3c232c]/62">
              No FAQs yet.
            </div>
          )}
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-[#efdad0] bg-white/60 p-5 shadow-sm md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-2xl font-bold text-[#3c232c]">{item.question}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.is_active ? 'bg-[#f8cdb4]/35 text-[#ad6a6c]' : 'bg-gray-100 text-gray-500'}`}>
                    {item.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-[#3c232c]/65">{item.answer}</p>
                <p className="mt-3 text-xs font-semibold text-[#3c232c]/45">Sort order {item.sort_order}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <AdminButton type="button" variant="secondary" onClick={() => openEdit(item)}>
                  Edit
                </AdminButton>
                <DeleteButton onClick={() => setDeleteTarget(item)} />
              </div>
            </article>
          ))}
        </div>

        <AdminModal
          open={isModalOpen}
          title={form.id ? 'Edit FAQ' : 'Create FAQ'}
          description="Questions marked active are visible on the public site."
          onClose={requestCloseModal}
        >
          <form onSubmit={saveItem} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-[1fr_180px]">
              <Field label="Question">
                <TextInput value={form.question} onChange={(event) => updateForm('question', event.target.value)} required />
              </Field>
              <Field label="Sort Order">
                <TextInput type="number" value={form.sort_order} onChange={(event) => updateForm('sort_order', Number(event.target.value))} />
              </Field>
            </div>
            <Field label="Answer">
              <TextArea value={form.answer} onChange={(event) => updateForm('answer', event.target.value)} required />
            </Field>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#3c232c]/70">
              <input type="checkbox" checked={form.is_active} onChange={(event) => updateForm('is_active', event.target.checked)} />
              Active on public website
            </label>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AdminButton type="button" variant="secondary" onClick={requestCloseModal} disabled={isSaving}>
                Cancel
              </AdminButton>
              <SaveButton disabled={isSaving}>{isSaving ? 'Saving...' : form.id ? 'Update FAQ' : 'Create FAQ'}</SaveButton>
            </div>
          </form>
        </AdminModal>

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete FAQ?"
          description={`This will remove "${deleteTarget?.question ?? 'this question'}" from the FAQ list.`}
          confirmLabel="Delete FAQ"
          danger
          isLoading={isSaving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteItem}
        />

        <ConfirmModal
          open={showDiscardConfirm}
          title="Discard unsaved changes?"
          description="You have changes that are not saved yet."
          confirmLabel="Discard"
          danger
          onCancel={() => setShowDiscardConfirm(false)}
          onConfirm={() => {
            setShowDiscardConfirm(false)
            closeModal()
          }}
        />
      </AdminShell>
    </AdminGuard>
  )
}
