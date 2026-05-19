import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { DeleteButton, Field, SaveButton, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminShell } from '../../components/admin/AdminShell'
import { supabase } from '../../lib/supabase'

type ServiceRow = {
  id?: string
  name: string
  description: string
  professional_background: string
  expertise: string[]
  tools: string[]
  icon_name: string
  image_url: string
  price_range: string
  tier: string
  sort_order: number
  is_active: boolean
}

const emptyService: ServiceRow = {
  name: '',
  description: '',
  professional_background: '',
  expertise: [],
  tools: [],
  icon_name: '',
  image_url: '',
  price_range: '',
  tier: '',
  sort_order: 0,
  is_active: true,
}

export function AdminServicesPage() {
  const [items, setItems] = useState<ServiceRow[]>([])
  const [form, setForm] = useState<ServiceRow>(emptyService)
  const [expertiseText, setExpertiseText] = useState('')
  const [toolsText, setToolsText] = useState('')
  const [status, setStatus] = useState('')

  const loadItems = async () => {
    const { data } = await supabase!.from('services').select('*').order('sort_order')
    setItems(data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const { data } = await supabase!.from('services').select('*').order('sort_order')
      setItems(data ?? [])
    }

    void loadInitialItems()
  }, [])

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('Saving...')
    const payload = {
      ...form,
      expertise: expertiseText.split('\n').map((item) => item.trim()).filter(Boolean),
      tools: toolsText.split(',').map((item) => item.trim()).filter(Boolean),
    }
    const { error } = await supabase!.from('services').upsert(payload)
    setStatus(error ? error.message : 'Service saved.')
    if (!error) {
      setForm(emptyService)
      setExpertiseText('')
      setToolsText('')
      await loadItems()
    }
  }

  const deleteItem = async (id?: string) => {
    if (!id) return
    await supabase!.from('services').delete().eq('id', id)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="Services" description="Manage the services shown on the public website.">
        <form onSubmit={saveItem} className="mb-8 grid gap-5 rounded-lg border border-coffee/10 bg-white/45 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Service Name">
              <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </Field>
            <Field label="Price Range">
              <TextInput value={form.price_range} onChange={(event) => setForm({ ...form, price_range: event.target.value })} />
            </Field>
            <Field label="Tier">
              <TextInput value={form.tier} onChange={(event) => setForm({ ...form, tier: event.target.value })} />
            </Field>
            <Field label="Iconify Icon Name">
              <TextInput value={form.icon_name} onChange={(event) => setForm({ ...form, icon_name: event.target.value })} placeholder="solar:palette-bold-duotone" />
            </Field>
            <Field label="Image URL">
              <TextInput value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />
            </Field>
            <Field label="Sort Order">
              <TextInput type="number" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} />
            </Field>
          </div>
          <Field label="Description">
            <TextArea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
          </Field>
          <Field label="Professional Background">
            <TextArea value={form.professional_background} onChange={(event) => setForm({ ...form, professional_background: event.target.value })} />
          </Field>
          <Field label="Expertise / Skills (one per line)">
            <TextArea value={expertiseText} onChange={(event) => setExpertiseText(event.target.value)} />
          </Field>
          <Field label="Tool Icons (Iconify names, comma-separated)">
            <TextInput value={toolsText} onChange={(event) => setToolsText(event.target.value)} placeholder="simple-icons:canva, devicon:photoshop" />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
            Active on public website
          </label>
          <div className="flex items-center gap-4">
            <SaveButton>{form.id ? 'Update Service' : 'Create Service'}</SaveButton>
            {status && <p className="text-sm text-ink/62">{status}</p>}
          </div>
        </form>
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-lg border border-coffee/10 bg-white/40 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-serif text-2xl text-ink">{item.name}</h2>
                <p className="mt-2 text-sm text-ink/62">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setForm(item)
                    setExpertiseText((item.expertise ?? []).join('\n'))
                    setToolsText((item.tools ?? []).join(', '))
                  }}
                  className="rounded-full border border-coffee/20 px-4 py-2 text-sm text-ink"
                >
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
