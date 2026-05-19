import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { DeleteButton, Field, SaveButton, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminShell } from '../../components/admin/AdminShell'
import { categories } from '../../data/site'
import { supabase } from '../../lib/supabase'

type PortfolioRow = {
  id?: string
  title: string
  slug: string
  category: string
  summary: string
  description: string
  outcome: string
  cover_url: string
  technologies: string[]
  sort_order: number
  featured: boolean
}

const emptyPortfolio: PortfolioRow = {
  title: '',
  slug: '',
  category: 'Research',
  summary: '',
  description: '',
  outcome: '',
  cover_url: '',
  technologies: [],
  sort_order: 0,
  featured: false,
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioRow[]>([])
  const [form, setForm] = useState<PortfolioRow>(emptyPortfolio)
  const [techText, setTechText] = useState('')
  const [status, setStatus] = useState('')

  const loadItems = async () => {
    const { data } = await supabase!.from('portfolio_items').select('*').order('sort_order')
    setItems(data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const { data } = await supabase!.from('portfolio_items').select('*').order('sort_order')
      setItems(data ?? [])
    }

    void loadInitialItems()
  }, [])

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('Saving...')
    const payload = {
      ...form,
      slug: form.slug || toSlug(form.title),
      technologies: techText.split(',').map((item) => item.trim()).filter(Boolean),
    }
    const { error } = await supabase!.from('portfolio_items').upsert(payload)
    setStatus(error ? error.message : 'Portfolio item saved.')
    if (!error) {
      setForm(emptyPortfolio)
      setTechText('')
      await loadItems()
    }
  }

  const editItem = (item: PortfolioRow) => {
    setForm(item)
    setTechText((item.technologies ?? []).join(', '))
  }

  const deleteItem = async (id?: string) => {
    if (!id) return
    await supabase!.from('portfolio_items').delete().eq('id', id)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="Portfolio" description="Manage public project cards and portfolio details.">
        <form onSubmit={saveItem} className="mb-8 grid gap-5 rounded-lg border border-coffee/10 bg-white/45 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title">
              <TextInput value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </Field>
            <Field label="Slug">
              <TextInput value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="auto-generated if blank" />
            </Field>
            <Field label="Category">
              <select className="rounded-md border border-coffee/15 bg-white/55 px-3 py-2 text-ink" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                {categories.filter((category) => category !== 'All').map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </Field>
            <Field label="Cover Image URL">
              <TextInput value={form.cover_url} onChange={(event) => setForm({ ...form, cover_url: event.target.value })} />
            </Field>
            <Field label="Technologies/Tools">
              <TextInput value={techText} onChange={(event) => setTechText(event.target.value)} placeholder="Canva, Excel, Google Workspace" />
            </Field>
            <Field label="Sort Order">
              <TextInput type="number" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} />
            </Field>
          </div>
          <Field label="Summary">
            <TextArea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} required />
          </Field>
          <Field label="Description">
            <TextArea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </Field>
          <Field label="Outcome">
            <TextArea value={form.outcome} onChange={(event) => setForm({ ...form, outcome: event.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
            Featured
          </label>
          <div className="flex items-center gap-4">
            <SaveButton>{form.id ? 'Update Project' : 'Create Project'}</SaveButton>
            {status && <p className="text-sm text-ink/62">{status}</p>}
          </div>
        </form>

        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-lg border border-coffee/10 bg-white/40 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-coffee">{item.category}</p>
                <h2 className="mt-1 font-serif text-2xl text-ink">{item.title}</h2>
                <p className="mt-2 text-sm text-ink/62">{item.summary}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => editItem(item)} className="rounded-full border border-coffee/20 px-4 py-2 text-sm text-ink">
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
