import { useEffect, useState } from 'react'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminShell } from '../../components/admin/AdminShell'
import { supabase } from '../../lib/supabase'

type InquiryRow = {
  id: string
  name: string
  email: string
  service_needed: string
  budget_range: string | null
  message: string
  status: string
  created_at: string
}

export function AdminInquiriesPage() {
  const [items, setItems] = useState<InquiryRow[]>([])

  const loadItems = async () => {
    const { data } = await supabase!.from('inquiries').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const { data } = await supabase!.from('inquiries').select('*').order('created_at', { ascending: false })
      setItems(data ?? [])
    }

    void loadInitialItems()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase!.from('inquiries').update({ status }).eq('id', id)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="Messages" description="View client inquiries submitted through the website.">
        <div className="grid gap-4">
          {items.length === 0 && (
            <div className="rounded-lg border border-coffee/10 bg-white/45 p-6 text-ink/62">
              No inquiries yet. The public contact form still needs Laravel submission wiring.
            </div>
          )}
          {items.map((item) => (
            <article key={item.id} className="rounded-lg border border-coffee/10 bg-white/45 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-ink">{item.name}</h2>
                  <p className="mt-1 text-sm text-ink/62">{item.email}</p>
                  <p className="mt-3 font-semibold text-coffee">{item.service_needed}</p>
                  {item.budget_range && <p className="mt-1 text-sm text-ink/62">Budget: {item.budget_range}</p>}
                </div>
                <select
                  value={item.status}
                  onChange={(event) => updateStatus(item.id, event.target.value)}
                  className="rounded-full border border-coffee/15 bg-white/55 px-4 py-2 text-sm text-ink"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-md bg-cream/70 p-4 text-sm leading-6 text-ink/72">{item.message}</p>
              <p className="mt-3 text-xs text-ink/45">{new Date(item.created_at).toLocaleString()}</p>
            </article>
          ))}
        </div>
      </AdminShell>
    </AdminGuard>
  )
}
