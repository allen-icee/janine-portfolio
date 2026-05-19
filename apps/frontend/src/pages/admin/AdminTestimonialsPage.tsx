import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { DeleteButton, Field, SaveButton, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminShell } from '../../components/admin/AdminShell'
import { supabase } from '../../lib/supabase'

type TestimonialRow = {
  id?: string
  client_name: string
  service: string
  preview: string
  feedback: string
  rating: number
  project_type: string
  feedback_date: string
  is_verified: boolean
}

const emptyTestimonial: TestimonialRow = {
  client_name: '',
  service: '',
  preview: '',
  feedback: '',
  rating: 5,
  project_type: '',
  feedback_date: '',
  is_verified: true,
}

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialRow[]>([])
  const [form, setForm] = useState<TestimonialRow>(emptyTestimonial)
  const [status, setStatus] = useState('')

  const loadItems = async () => {
    const { data } = await supabase!.from('testimonials').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const { data } = await supabase!.from('testimonials').select('*').order('created_at', { ascending: false })
      setItems(data ?? [])
    }

    void loadInitialItems()
  }, [])

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('Saving...')
    const { error } = await supabase!.from('testimonials').upsert(form)
    setStatus(error ? error.message : 'Testimonial saved.')
    if (!error) {
      setForm(emptyTestimonial)
      await loadItems()
    }
  }

  const deleteItem = async (id?: string) => {
    if (!id) return
    await supabase!.from('testimonials').delete().eq('id', id)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="Testimonials" description="Manage client feedback shown on the public website.">
        <form onSubmit={saveItem} className="mb-8 grid gap-5 rounded-lg border border-coffee/10 bg-white/45 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Client Name">
              <TextInput value={form.client_name} onChange={(event) => setForm({ ...form, client_name: event.target.value })} required />
            </Field>
            <Field label="Service">
              <TextInput value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })} required />
            </Field>
            <Field label="Rating">
              <TextInput type="number" min={1} max={5} value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })} />
            </Field>
            <Field label="Feedback Date">
              <TextInput type="date" value={form.feedback_date ?? ''} onChange={(event) => setForm({ ...form, feedback_date: event.target.value })} />
            </Field>
          </div>
          <Field label="Preview">
            <TextArea value={form.preview} onChange={(event) => setForm({ ...form, preview: event.target.value })} required />
          </Field>
          <Field label="Full Feedback">
            <TextArea value={form.feedback} onChange={(event) => setForm({ ...form, feedback: event.target.value })} required />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={form.is_verified} onChange={(event) => setForm({ ...form, is_verified: event.target.checked })} />
            Verified client
          </label>
          <div className="flex items-center gap-4">
            <SaveButton>{form.id ? 'Update Testimonial' : 'Create Testimonial'}</SaveButton>
            {status && <p className="text-sm text-ink/62">{status}</p>}
          </div>
        </form>

        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-lg border border-coffee/10 bg-white/40 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-serif text-2xl text-ink">{item.client_name}</h2>
                <p className="mt-1 text-sm text-coffee">{item.service}</p>
                <p className="mt-2 text-sm text-ink/62">{item.preview}</p>
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
