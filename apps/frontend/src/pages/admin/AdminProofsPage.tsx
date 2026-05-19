import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { DeleteButton, Field, SaveButton, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminShell } from '../../components/admin/AdminShell'
import { supabase } from '../../lib/supabase'

type ProofRow = {
  id?: string
  title: string
  description: string
  image_url: string
  category: string
  is_featured: boolean
  sort_order: number
}

const emptyProof: ProofRow = {
  title: '',
  description: '',
  image_url: '',
  category: 'Client Feedback',
  is_featured: false,
  sort_order: 0,
}

export function AdminProofsPage() {
  const [items, setItems] = useState<ProofRow[]>([])
  const [form, setForm] = useState<ProofRow>(emptyProof)
  const [status, setStatus] = useState('')

  const loadItems = async () => {
    const { data } = await supabase!.from('proof_items').select('*').order('sort_order')
    setItems(data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const { data } = await supabase!.from('proof_items').select('*').order('sort_order')
      setItems(data ?? [])
    }

    void loadInitialItems()
  }, [])

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('Saving...')
    const { error } = await supabase!.from('proof_items').upsert(form)
    setStatus(error ? error.message : 'Proof saved.')
    if (!error) {
      setForm(emptyProof)
      await loadItems()
    }
  }

  const deleteItem = async (id?: string) => {
    if (!id) return
    await supabase!.from('proof_items').delete().eq('id', id)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="Proof Gallery" description="Manage client proof screenshots, testimonials, and completed-work images.">
        <form onSubmit={saveItem} className="mb-8 grid gap-5 rounded-lg border border-coffee/10 bg-white/45 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title">
              <TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </Field>
            <Field label="Category">
              <TextInput value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
            </Field>
            <Field label="Image URL">
              <TextInput value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />
            </Field>
            <Field label="Sort Order">
              <TextInput type="number" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} />
            </Field>
          </div>
          <Field label="Description">
            <TextArea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={form.is_featured} onChange={(event) => setForm({ ...form, is_featured: event.target.checked })} />
            Featured proof
          </label>
          <div className="flex items-center gap-4">
            <SaveButton>{form.id ? 'Update Proof' : 'Create Proof'}</SaveButton>
            {status && <p className="text-sm text-ink/62">{status}</p>}
          </div>
        </form>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-lg border border-coffee/10 bg-white/40 p-5">
              {item.image_url && <img src={item.image_url} alt={item.title} className="mb-4 aspect-video w-full rounded-md object-cover" />}
              <h2 className="font-serif text-2xl text-ink">{item.title}</h2>
              <p className="mt-1 text-sm text-coffee">{item.category}</p>
              <p className="mt-2 text-sm text-ink/62">{item.description}</p>
              <div className="mt-4 flex gap-2">
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
