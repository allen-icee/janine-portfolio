import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { ImagePlus, Plus } from 'lucide-react'
import { AdminButton, DeleteButton, Field, SaveButton, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminModal, ConfirmModal } from '../../components/admin/AdminModal'
import { AdminShell } from '../../components/admin/AdminShell'
import { uploadAdminImage } from '../../lib/adminUploads'
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProofRow | null>(null)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const loadItems = async () => {
    const { data, error } = await supabase!.from('proof_items').select('*').order('sort_order')
    if (error) {
      toast.error(error.message)
      return
    }
    setItems(data ?? [])
  }

  useEffect(() => {
    const loadInitialItems = async () => {
      const { data, error } = await supabase!.from('proof_items').select('*').order('sort_order')
      if (error) {
        toast.error(error.message)
        return
      }
      setItems(data ?? [])
    }

    void loadInitialItems()
  }, [])

  const updateForm = <Key extends keyof ProofRow>(key: Key, value: ProofRow[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setIsDirty(true)
  }

  const openCreate = () => {
    setForm({ ...emptyProof, sort_order: items.length })
    setImageFile(null)
    setIsDirty(false)
    setIsModalOpen(true)
  }

  const openEdit = (item: ProofRow) => {
    setForm(item)
    setImageFile(null)
    setIsDirty(false)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setImageFile(null)
    setIsDirty(false)
  }

  const requestCloseModal = () => {
    if (isDirty || imageFile) {
      setShowDiscardConfirm(true)
      return
    }
    closeModal()
  }

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const uploadedUrl = imageFile ? await uploadAdminImage(imageFile, 'proofs') : form.image_url
      const { error } = await supabase!.from('proof_items').upsert({ ...form, image_url: uploadedUrl })
      if (error) throw error

      toast.success(form.id ? 'Proof updated.' : 'Proof created.')
      closeModal()
      await loadItems()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save proof.')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteItem = async () => {
    if (!deleteTarget?.id) return
    setIsSaving(true)

    const { error } = await supabase!.from('proof_items').delete().eq('id', deleteTarget.id)
    setIsSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Proof deleted.')
    setDeleteTarget(null)
    await loadItems()
  }

  return (
    <AdminGuard>
      <AdminShell title="Proof Gallery" description="Create proof entries, upload screenshots, and manage what appears in the proof section.">
        <div className="mb-6 flex justify-end">
          <AdminButton type="button" onClick={openCreate}>
            <Plus size={16} />
            Proof
          </AdminButton>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.length === 0 && (
            <div className="rounded-2xl border border-[#efdad0] bg-white/55 p-8 text-center text-[#3c232c]/62 md:col-span-2 xl:col-span-3">
              No proofs yet.
            </div>
          )}
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-[#efdad0] bg-white/60 shadow-sm">
              <div className="aspect-[4/3] bg-[#f8cdb4]/15">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="grid h-full place-items-center text-[#ad6a6c]">
                    <ImagePlus size={32} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#ad6a6c]">{item.category}</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#3c232c]">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#3c232c]/65">{item.description}</p>
                <div className="mt-5 flex gap-2">
                  <AdminButton type="button" variant="secondary" onClick={() => openEdit(item)}>
                    Edit
                  </AdminButton>
                  <DeleteButton onClick={() => setDeleteTarget(item)} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <AdminModal
          open={isModalOpen}
          title={form.id ? 'Edit Proof' : 'Create Proof'}
          description="Upload an image directly from the admin dashboard."
          onClose={requestCloseModal}
        >
          <form onSubmit={saveItem} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Title">
                <TextInput value={form.title} onChange={(event) => updateForm('title', event.target.value)} required />
              </Field>
              <Field label="Category">
                <TextInput value={form.category} onChange={(event) => updateForm('category', event.target.value)} />
              </Field>
              <Field label="Sort Order">
                <TextInput type="number" value={form.sort_order} onChange={(event) => updateForm('sort_order', Number(event.target.value))} />
              </Field>
              <Field label="Image URL" hint="Optional if uploading a file below.">
                <TextInput value={form.image_url} onChange={(event) => updateForm('image_url', event.target.value)} />
              </Field>
            </div>

            <Field label="Upload Image">
              <div className="rounded-2xl border border-dashed border-[#ad6a6c]/35 bg-white/50 p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setImageFile(event.target.files?.[0] ?? null)
                    setIsDirty(true)
                  }}
                  className="w-full text-sm text-[#3c232c]/70 file:mr-4 file:rounded-full file:border-0 file:bg-[#ad6a6c] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                {imageFile && <p className="mt-3 text-sm text-[#3c232c]/60">Selected: {imageFile.name}</p>}
                {form.image_url && !imageFile && <img src={form.image_url} alt="Current proof" className="mt-4 h-36 rounded-xl object-cover object-top" />}
              </div>
            </Field>

            <Field label="Description">
              <TextArea value={form.description} onChange={(event) => updateForm('description', event.target.value)} />
            </Field>

            <label className="flex items-center gap-2 text-sm font-semibold text-[#3c232c]/70">
              <input type="checkbox" checked={form.is_featured} onChange={(event) => updateForm('is_featured', event.target.checked)} />
              Featured proof
            </label>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AdminButton type="button" variant="secondary" onClick={requestCloseModal} disabled={isSaving}>
                Cancel
              </AdminButton>
              <SaveButton disabled={isSaving}>{isSaving ? 'Saving...' : form.id ? 'Update Proof' : 'Create Proof'}</SaveButton>
            </div>
          </form>
        </AdminModal>

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete proof?"
          description={`This will remove "${deleteTarget?.title ?? 'this proof'}" from the proof gallery.`}
          confirmLabel="Delete Proof"
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
