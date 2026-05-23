import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Star } from 'lucide-react'
import { DeleteButton } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { ConfirmModal } from '../../components/admin/AdminModal'
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

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialRow[]>([])
  const [deleteTarget, setDeleteTarget] = useState<TestimonialRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadItems = async () => {
    const { data, error } = await supabase!.from('testimonials').select('*').order('created_at', { ascending: false })
    if (error) {
      toast.error(error.message)
      return
    }
    setItems(data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const { data, error } = await supabase!.from('testimonials').select('*').order('created_at', { ascending: false })
      if (error) {
        toast.error(error.message)
        return
      }
      setItems(data ?? [])
    }

    void loadInitialItems()
  }, [])

  const deleteItem = async () => {
    if (!deleteTarget?.id) return
    setIsDeleting(true)

    const { error } = await supabase!.from('testimonials').delete().eq('id', deleteTarget.id)
    setIsDeleting(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Client feedback removed.')
    setDeleteTarget(null)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="Client Feedback" description="Review testimonials and remove entries that should no longer appear publicly.">
        <div className="grid gap-4">
          {items.length === 0 && (
            <div className="rounded-2xl border border-[#efdad0] bg-white/55 p-8 text-center text-[#3c232c]/62">
              No testimonials yet.
            </div>
          )}
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[#efdad0] bg-white/60 p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-3 flex gap-1 text-[#ad6a6c]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={16} fill={index < item.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-[#3c232c]">{item.client_name}</h2>
                  <p className="mt-1 text-sm font-semibold text-[#ad6a6c]">{item.service}</p>
                  <p className="mt-4 max-w-4xl text-sm leading-6 text-[#3c232c]/70">{item.feedback}</p>
                  {item.feedback_date && <p className="mt-3 text-xs font-semibold text-[#3c232c]/45">{item.feedback_date}</p>}
                </div>
                <DeleteButton onClick={() => setDeleteTarget(item)}>Remove</DeleteButton>
              </div>
            </article>
          ))}
        </div>

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Remove feedback?"
          description={`This will remove "${deleteTarget?.client_name ?? 'this client'}" from client feedback.`}
          confirmLabel="Remove Feedback"
          danger
          isLoading={isDeleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteItem}
        />
      </AdminShell>
    </AdminGuard>
  )
}
