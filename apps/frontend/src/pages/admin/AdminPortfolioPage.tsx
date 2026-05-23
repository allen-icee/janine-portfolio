import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Edit3, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { AdminButton, DeleteButton, Field, SaveButton, SelectInput, TextArea, TextInput } from '../../components/admin/AdminFields'
import { AdminGuard } from '../../components/admin/AdminGuard'
import { AdminModal, ConfirmModal } from '../../components/admin/AdminModal'
import { AdminShell } from '../../components/admin/AdminShell'
import { categories as fallbackCategories } from '../../data/site'
import { uploadAdminImage } from '../../lib/adminUploads'
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

type CategoryRow = {
  id?: string
  name: string
  sort_order: number
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

const emptyCategory: CategoryRow = {
  name: '',
  sort_order: 0,
}

const defaultCategoryRows = fallbackCategories
  .filter((category) => category !== 'All')
  .map((name, index) => ({ name, sort_order: index }))

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioRow[]>([])
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>(defaultCategoryRows)
  const [activeCategory, setActiveCategory] = useState('All')
  const [form, setForm] = useState<PortfolioRow>(emptyPortfolio)
  const [categoryForm, setCategoryForm] = useState<CategoryRow>(emptyCategory)
  const [techText, setTechText] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isCategoryDirty, setIsCategoryDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PortfolioRow | null>(null)
  const [categoryDeleteTarget, setCategoryDeleteTarget] = useState<CategoryRow | null>(null)
  const [pendingClose, setPendingClose] = useState<'project' | 'category' | null>(null)

  const categoryNames = useMemo(() => categoryRows.map((category) => category.name), [categoryRows])

  const visibleItems = useMemo(() => {
    if (activeCategory === 'All') return items
    return items.filter((item) => item.category === activeCategory)
  }, [activeCategory, items])

  const loadItems = async () => {
    const { data, error } = await supabase!.from('portfolio_items').select('*').order('sort_order')
    if (error) {
      toast.error(error.message)
      return
    }
    setItems(data ?? [])
  }

  const loadCategories = async () => {
    const { data, error } = await supabase!.from('portfolio_categories').select('*').order('sort_order')
    if (error) {
      setCategoryRows(defaultCategoryRows)
      return
    }
    setCategoryRows(data?.length ? data : defaultCategoryRows)
  }

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([loadItems(), loadCategories()])
    }

    void loadInitialData()
  }, [])

  const updateForm = <Key extends keyof PortfolioRow>(key: Key, value: PortfolioRow[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setIsDirty(true)
  }

  const updateCategoryForm = <Key extends keyof CategoryRow>(key: Key, value: CategoryRow[Key]) => {
    setCategoryForm((current) => ({ ...current, [key]: value }))
    setIsCategoryDirty(true)
  }

  const openCreateProject = () => {
    setForm({ ...emptyPortfolio, category: categoryNames[0] ?? 'Research', sort_order: items.length })
    setTechText('')
    setImageFile(null)
    setIsDirty(false)
    setIsProjectModalOpen(true)
  }

  const openEditProject = (item: PortfolioRow) => {
    setForm(item)
    setTechText((item.technologies ?? []).join(', '))
    setImageFile(null)
    setIsDirty(false)
    setIsProjectModalOpen(true)
  }

  const closeProjectModal = () => {
    setIsProjectModalOpen(false)
    setIsDirty(false)
    setImageFile(null)
  }

  const requestCloseProjectModal = () => {
    if (isDirty || imageFile) {
      setPendingClose('project')
      return
    }
    closeProjectModal()
  }

  const openCreateCategory = () => {
    setCategoryForm({ ...emptyCategory, sort_order: categoryRows.length })
    setIsCategoryDirty(false)
    setIsCategoryModalOpen(true)
  }

  const openEditCategory = (category: CategoryRow) => {
    setCategoryForm(category)
    setIsCategoryDirty(false)
    setIsCategoryModalOpen(true)
  }

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false)
    setIsCategoryDirty(false)
  }

  const requestCloseCategoryModal = () => {
    if (isCategoryDirty) {
      setPendingClose('category')
      return
    }
    closeCategoryModal()
  }

  const saveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const uploadedUrl = imageFile ? await uploadAdminImage(imageFile, 'portfolio') : form.cover_url
      const payload = {
        ...form,
        slug: form.slug || toSlug(form.title),
        cover_url: uploadedUrl,
        technologies: techText
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }

      const { error } = await supabase!.from('portfolio_items').upsert(payload)
      if (error) throw error

      toast.success(form.id ? 'Portfolio item updated.' : 'Portfolio item created.')
      closeProjectModal()
      await loadItems()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save portfolio item.')
    } finally {
      setIsSaving(false)
    }
  }

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const { error } = await supabase!.from('portfolio_categories').upsert(categoryForm)
      if (error) throw error

      toast.success(categoryForm.id ? 'Category updated.' : 'Category created.')
      closeCategoryModal()
      await loadCategories()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save category.')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteProject = async () => {
    if (!deleteTarget?.id) return
    setIsSaving(true)

    const { error } = await supabase!.from('portfolio_items').delete().eq('id', deleteTarget.id)
    setIsSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Portfolio item deleted.')
    setDeleteTarget(null)
    await loadItems()
  }

  const deleteCategory = async () => {
    if (!categoryDeleteTarget?.id) return
    setIsSaving(true)

    const { error } = await supabase!.from('portfolio_categories').delete().eq('id', categoryDeleteTarget.id)
    setIsSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Category deleted.')
    if (activeCategory === categoryDeleteTarget.name) {
      setActiveCategory('All')
    }
    setCategoryDeleteTarget(null)
    await loadCategories()
  }

  return (
    <AdminGuard>
      <AdminShell title="Portfolio" description="Create project cards, manage category tabs, and upload cover images.">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', ...categoryNames].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                  activeCategory === category
                    ? 'border-[#ad6a6c] bg-[#ad6a6c] text-white'
                    : 'border-[#efdad0] bg-white/60 text-[#3c232c]/70 hover:border-[#ad6a6c] hover:bg-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton type="button" variant="secondary" onClick={openCreateCategory}>
              <Plus size={16} />
              Category
            </AdminButton>
            <AdminButton type="button" onClick={openCreateProject}>
              <Plus size={16} />
              Portfolio Item
            </AdminButton>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-[#efdad0] bg-white/50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-bold text-[#3c232c]">Categories</h2>
            <p className="text-sm text-[#3c232c]/55">{categoryRows.length} tabs</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {categoryRows.map((category) => (
              <article key={category.id ?? category.name} className="flex items-center justify-between gap-3 rounded-xl border border-[#efdad0] bg-white/70 p-3">
                <div>
                  <p className="font-semibold text-[#3c232c]">{category.name}</p>
                  <p className="text-xs text-[#3c232c]/50">Sort order {category.sort_order}</p>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => openEditCategory(category)} className="grid size-9 place-items-center rounded-full text-[#3c232c]/70 hover:bg-[#f8cdb4]/25">
                    <Edit3 size={15} />
                  </button>
                  {category.id && (
                    <button type="button" onClick={() => setCategoryDeleteTarget(category)} className="grid size-9 place-items-center rounded-full text-red-600 hover:bg-red-50">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          {visibleItems.length === 0 && (
            <div className="rounded-2xl border border-[#efdad0] bg-white/55 p-8 text-center text-[#3c232c]/62">
              No portfolio items in this tab yet.
            </div>
          )}
          {visibleItems.map((item) => (
            <article key={item.id} className="grid gap-4 rounded-2xl border border-[#efdad0] bg-white/60 p-4 shadow-sm sm:grid-cols-[160px_1fr]">
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#efdad0] bg-[#f8cdb4]/15">
                {item.cover_url ? (
                  <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-[#ad6a6c]">
                    <ImagePlus size={28} />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#ad6a6c]">{item.category}</p>
                  <h2 className="mt-1 font-serif text-2xl font-bold text-[#3c232c]">{item.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#3c232c]/65">{item.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(item.technologies ?? []).map((tool) => (
                      <span key={tool} className="rounded-full bg-[#f8cdb4]/30 px-3 py-1 text-xs font-semibold text-[#3c232c]/75">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <AdminButton type="button" variant="secondary" onClick={() => openEditProject(item)}>
                    Edit
                  </AdminButton>
                  <DeleteButton onClick={() => setDeleteTarget(item)} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <AdminModal
          open={isProjectModalOpen}
          title={form.id ? 'Edit Portfolio Item' : 'Create Portfolio Item'}
          description="Save project details and upload a cover image from your computer."
          onClose={requestCloseProjectModal}
        >
          <form onSubmit={saveProject} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Title">
                <TextInput value={form.title} onChange={(event) => updateForm('title', event.target.value)} required />
              </Field>
              <Field label="Slug" hint="Leave blank to generate from the title.">
                <TextInput value={form.slug} onChange={(event) => updateForm('slug', event.target.value)} placeholder="auto-generated if blank" />
              </Field>
              <Field label="Category">
                <SelectInput value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
                  {categoryNames.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Sort Order">
                <TextInput type="number" value={form.sort_order} onChange={(event) => updateForm('sort_order', Number(event.target.value))} />
              </Field>
              <Field label="Technologies / Tools" hint="Separate tools with commas.">
                <TextInput value={techText} onChange={(event) => {
                  setTechText(event.target.value)
                  setIsDirty(true)
                }} placeholder="Canva, Excel, Google Workspace" />
              </Field>
              <Field label="Cover Image URL" hint="Optional if uploading an image below.">
                <TextInput value={form.cover_url} onChange={(event) => updateForm('cover_url', event.target.value)} />
              </Field>
            </div>

            <Field label="Upload Cover Image">
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
                {form.cover_url && !imageFile && <img src={form.cover_url} alt="Current cover" className="mt-4 h-36 rounded-xl object-cover" />}
              </div>
            </Field>

            <Field label="Summary">
              <TextArea value={form.summary} onChange={(event) => updateForm('summary', event.target.value)} required />
            </Field>
            <Field label="Description">
              <TextArea value={form.description} onChange={(event) => updateForm('description', event.target.value)} />
            </Field>
            <Field label="Outcome">
              <TextArea value={form.outcome} onChange={(event) => updateForm('outcome', event.target.value)} />
            </Field>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#3c232c]/70">
              <input type="checkbox" checked={form.featured} onChange={(event) => updateForm('featured', event.target.checked)} />
              Featured
            </label>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AdminButton type="button" variant="secondary" onClick={requestCloseProjectModal} disabled={isSaving}>
                Cancel
              </AdminButton>
              <SaveButton disabled={isSaving}>{isSaving ? 'Saving...' : form.id ? 'Update Item' : 'Create Item'}</SaveButton>
            </div>
          </form>
        </AdminModal>

        <AdminModal
          open={isCategoryModalOpen}
          title={categoryForm.id ? 'Edit Category' : 'Create Category'}
          description="Categories become tabs for portfolio filtering."
          onClose={requestCloseCategoryModal}
          widthClassName="max-w-xl"
        >
          <form onSubmit={saveCategory} className="grid gap-5">
            <Field label="Category Name">
              <TextInput value={categoryForm.name} onChange={(event) => updateCategoryForm('name', event.target.value)} required />
            </Field>
            <Field label="Sort Order">
              <TextInput type="number" value={categoryForm.sort_order} onChange={(event) => updateCategoryForm('sort_order', Number(event.target.value))} />
            </Field>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AdminButton type="button" variant="secondary" onClick={requestCloseCategoryModal} disabled={isSaving}>
                Cancel
              </AdminButton>
              <SaveButton disabled={isSaving}>{isSaving ? 'Saving...' : categoryForm.id ? 'Update Category' : 'Create Category'}</SaveButton>
            </div>
          </form>
        </AdminModal>

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete portfolio item?"
          description={`This will remove "${deleteTarget?.title ?? 'this item'}" from the portfolio.`}
          confirmLabel="Delete Item"
          danger
          isLoading={isSaving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteProject}
        />

        <ConfirmModal
          open={Boolean(categoryDeleteTarget)}
          title="Delete category?"
          description={`This removes the "${categoryDeleteTarget?.name ?? 'category'}" tab. Existing projects keep their category text.`}
          confirmLabel="Delete Category"
          danger
          isLoading={isSaving}
          onCancel={() => setCategoryDeleteTarget(null)}
          onConfirm={deleteCategory}
        />

        <ConfirmModal
          open={Boolean(pendingClose)}
          title="Discard unsaved changes?"
          description="You have changes that are not saved yet."
          confirmLabel="Discard"
          danger
          onCancel={() => setPendingClose(null)}
          onConfirm={() => {
            if (pendingClose === 'project') closeProjectModal()
            if (pendingClose === 'category') closeCategoryModal()
            setPendingClose(null)
          }}
        />
      </AdminShell>
    </AdminGuard>
  )
}
