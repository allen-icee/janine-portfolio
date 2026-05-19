import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { DeleteButton, Field, SaveButton, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminShell } from '../../components/admin/AdminShell'
import { supabase } from '../../lib/supabase'
import type { ClientRecord } from '../../types/content'

const emptyClient: ClientRecord = {
  client_name: '',
  project_name: '',
  service: '',
  status: 'completed',
  start_date: '',
  end_date: '',
  notes: '',
}

export function AdminClientsPage() {
  const [items, setItems] = useState<ClientRecord[]>([])
  const [form, setForm] = useState<ClientRecord>(emptyClient)
  const [status, setStatus] = useState('')

  const loadItems = async () => {
    const { data } = await supabase!.from('client_records').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const { data } = await supabase!.from('client_records').select('*').order('created_at', { ascending: false })
      setItems(data ?? [])
    }

    void loadInitialItems()
  }, [])

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('Saving...')
    const { error } = await supabase!.from('client_records').upsert(form)
    setStatus(error ? error.message : 'Client record saved.')
    if (!error) {
      setForm(emptyClient)
      await loadItems()
    }
  }

  const deleteItem = async (id?: string) => {
    if (!id) return
    await supabase!.from('client_records').delete().eq('id', id)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="Client Records" description="Track completed clients, project status, services, notes, and delivery history.">
        <form onSubmit={saveItem} className="mb-8 grid gap-5 rounded-lg border border-coffee/10 bg-white/45 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Client Name">
              <TextInput value={form.client_name} onChange={(event) => setForm({ ...form, client_name: event.target.value })} required />
            </Field>
            <Field label="Project Name">
              <TextInput value={form.project_name ?? ''} onChange={(event) => setForm({ ...form, project_name: event.target.value })} />
            </Field>
            <Field label="Service">
              <TextInput value={form.service ?? ''} onChange={(event) => setForm({ ...form, service: event.target.value })} />
            </Field>
            <Field label="Status">
              <select className="rounded-md border border-coffee/15 bg-white/55 px-3 py-2 text-ink" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Start Date">
              <TextInput type="date" value={form.start_date ?? ''} onChange={(event) => setForm({ ...form, start_date: event.target.value })} />
            </Field>
            <Field label="End Date">
              <TextInput type="date" value={form.end_date ?? ''} onChange={(event) => setForm({ ...form, end_date: event.target.value })} />
            </Field>
          </div>
          <Field label="Notes">
            <TextArea value={form.notes ?? ''} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </Field>
          <div className="flex items-center gap-4">
            <SaveButton>{form.id ? 'Update Client' : 'Create Client'}</SaveButton>
            {status && <p className="text-sm text-ink/62">{status}</p>}
          </div>
        </form>
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-lg border border-coffee/10 bg-white/40 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-serif text-2xl text-ink">{item.client_name}</h2>
                <p className="mt-1 text-sm text-coffee">{item.project_name} | {item.service}</p>
                <p className="mt-2 text-sm text-ink/62">{item.notes}</p>
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
