import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { DeleteButton, Field, SaveButton, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
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
  const [status, setStatus] = useState('')

  const loadItems = async () => {
    const { data } = await supabase!.from('faqs').select('*').order('sort_order')
    setItems(data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const { data } = await supabase!.from('faqs').select('*').order('sort_order')
      setItems(data ?? [])
    }

    void loadInitialItems()
  }, [])

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('Saving...')
    const { error } = await supabase!.from('faqs').upsert(form)
    setStatus(error ? error.message : 'FAQ saved.')
    if (!error) {
      setForm(emptyFaq)
      await loadItems()
    }
  }

  const deleteItem = async (id?: string) => {
    if (!id) return
    await supabase!.from('faqs').delete().eq('id', id)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="FAQs" description="Manage public frequently asked questions.">
        <form onSubmit={saveItem} className="mb-8 grid gap-5 rounded-lg border border-coffee/10 bg-white/45 p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_160px]">
            <Field label="Question">
              <TextInput value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} required />
            </Field>
            <Field label="Sort Order">
              <TextInput type="number" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} />
            </Field>
          </div>
          <Field label="Answer">
            <TextArea value={form.answer} onChange={(event) => setForm({ ...form, answer: event.target.value })} required />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
            Active on public website
          </label>
          <div className="flex items-center gap-4">
            <SaveButton>{form.id ? 'Update FAQ' : 'Create FAQ'}</SaveButton>
            {status && <p className="text-sm text-ink/62">{status}</p>}
          </div>
        </form>

        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-lg border border-coffee/10 bg-white/40 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-serif text-2xl text-ink">{item.question}</h2>
                <p className="mt-2 text-sm text-ink/62">{item.answer}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm(item)} className="rounded-full border border-coffee/20 px-4 py-2 text-sm text-ink">
                  Edit
                </button>
                <DeleteButton onClick={() => deleteItem(item.id)} />
              </div>
            </article>
          ))}
        </div>
      </AdminShell>
    </AdminGuard>
  )
}
