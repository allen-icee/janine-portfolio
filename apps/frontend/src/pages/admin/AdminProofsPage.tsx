import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import {
  AdminButton,
  Field,
  SaveButton,
  TextArea,
  TextInput,
} from "../../components/admin/AdminFields";
import { AdminGuard } from "../../components/admin/AdminGuard";
import { AdminModal, ConfirmModal } from "../../components/admin/AdminModal";
import { AdminShell } from "../../components/admin/AdminShell";
import { deleteAdminImage, uploadAdminImage } from "../../lib/adminUploads";
import { supabase } from "../../lib/supabase";

type ProofRow = {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  is_featured: boolean;
  sort_order: number;
};

const emptyProof: ProofRow = {
  title: "",
  description: "",
  image_url: "",
  category: "Client Feedback",
  is_featured: false,
  sort_order: 0,
};

export function AdminProofsPage() {
  const [items, setItems] = useState<ProofRow[]>([]);
  const [form, setForm] = useState<ProofRow>(emptyProof);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProofRow | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const imagePreviewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile],
  );

  const loadItems = async () => {
    const { data, error } = await supabase!
      .from("proof_items")
      .select("*")
      .order("sort_order");
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems(data ?? []);
  };

  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      const { data, error } = await supabase!
        .from("proof_items")
        .select("*")
        .order("sort_order");

      if (error) {
        toast.error(error.message);
      } else if (mounted) {
        setItems(data ?? []);
      }
    };

    void fetchInitial();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  // DERIVED STATE for Filtering and Pagination
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / itemsPerPage),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const updateForm = <Key extends keyof ProofRow>(
    key: Key,
    value: ProofRow[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setIsDirty(true);
  };

  const openCreate = () => {
    setForm({ ...emptyProof, sort_order: items.length + 1 });
    setImageFile(null);
    setIsDirty(false);
    setIsModalOpen(true);
  };

  const openEdit = (item: ProofRow) => {
    setForm(item);
    setImageFile(null);
    setIsDirty(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageFile(null);
    setIsDirty(false);
  };

  const requestCloseModal = () => {
    if (isDirty || imageFile) {
      setShowDiscardConfirm(true);
      return;
    }
    closeModal();
  };

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const uploadedUrl = imageFile
        ? await uploadAdminImage(imageFile, "proofs")
        : form.image_url;
      const { error } = await supabase!
        .from("proof_items")
        .upsert({ ...form, image_url: uploadedUrl });
      if (error) throw error;

      toast.success(form.id ? "Proof updated." : "Proof created.");
      closeModal();
      await loadItems();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save proof.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async () => {
    if (!deleteTarget?.id) return;
    setIsSaving(true);

    const { error } = await supabase!
      .from("proof_items")
      .delete()
      .eq("id", deleteTarget.id);
    setIsSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    await deleteAdminImage(deleteTarget.image_url);
    toast.success("Proof deleted.");
    setDeleteTarget(null);
    await loadItems();
  };

  return (
    <AdminGuard>
      <AdminShell
        title="Proof Gallery"
        description="Create proof entries, upload screenshots, and manage what appears in the proof section."
      >
        {/* Top Actions: Search & Add Button */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Icon
              icon="ph:magnifying-glass-bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ad6a6c]"
            />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 while searching
              }}
              className="h-10 w-full rounded-xl border border-[#efdad0] bg-white/60 pl-10 pr-4 text-sm text-[#3c232c] outline-none transition-all focus:border-[#ad6a6c] focus:bg-white focus:ring-1 focus:ring-[#ad6a6c]/20"
            />
          </div>
          <AdminButton type="button" onClick={openCreate}>
            <Icon icon="ph:plus-bold" className="text-base" />
            Add Proof
          </AdminButton>
        </div>

        {/* ===================================================================== */}
        {/* COMPACT DATA TABLE (Image column removed) */}
        {/* ===================================================================== */}
        <div className="overflow-hidden rounded-[1.5rem] border border-[#efdad0] bg-white/60 shadow-sm backdrop-blur-md">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#efdad0]/60 bg-white/40 text-[10px] uppercase tracking-widest text-[#ad6a6c]">
                <tr>
                  <th className="w-16 px-5 py-4 font-bold">Order</th>
                  <th className="px-5 py-4 font-bold">Title & Category</th>
                  <th className="hidden px-5 py-4 font-bold lg:table-cell">
                    Description
                  </th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efdad0]/40">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-xs font-medium text-[#3c232c]/50"
                    >
                      {searchQuery
                        ? "No proofs match your search."
                        : "No proofs found. Create one to get started."}
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-white/50"
                    >
                      {/* Sort Order */}
                      <td className="px-5 py-3.5 font-bold text-[#3c232c]/70">
                        {item.sort_order}
                      </td>

                      {/* Title & Category */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[#3c232c] max-w-[200px] truncate">
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ad6a6c]">
                          {item.category}
                        </div>
                      </td>

                      {/* Truncated Description */}
                      <td className="hidden px-5 py-3.5 lg:table-cell">
                        <p className="max-w-[300px] truncate text-xs font-medium text-[#3c232c]/60 xl:max-w-[400px]">
                          {item.description}
                        </p>
                      </td>

                      {/* Featured Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            item.is_featured
                              ? "bg-[#ad6a6c]/10 text-[#ad6a6c]"
                              : "bg-[#e3d1d1]/30 text-[#3c232c]/50"
                          }`}
                        >
                          {item.is_featured && <Icon icon="ph:star-fill" />}
                          {item.is_featured ? "Featured" : "Standard"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(item)}
                            className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] transition-colors hover:bg-[#ad6a6c]/10"
                            title="Edit"
                          >
                            <Icon
                              icon="ph:pencil-simple-bold"
                              className="text-base"
                            />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] transition-colors hover:bg-red-500/10 hover:text-red-600"
                            title="Delete"
                          >
                            <Icon icon="ph:trash-bold" className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ===================================================================== */}
          {/* PAGINATION CONTROLS */}
          {/* ===================================================================== */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#efdad0]/60 bg-white/30 px-5 py-3 text-xs font-bold text-[#3c232c]/60">
              <span>
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredItems.length)} of{" "}
                {filteredItems.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="grid size-7 place-items-center rounded-md border border-[#efdad0] bg-white transition hover:border-[#ad6a6c] hover:text-[#ad6a6c] disabled:opacity-50 disabled:hover:border-[#efdad0] disabled:hover:text-[#3c232c]/60"
                >
                  <Icon icon="ph:caret-left-bold" />
                </button>
                <span className="min-w-[2rem] text-center text-[#ad6a6c]">
                  {safeCurrentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safeCurrentPage === totalPages}
                  className="grid size-7 place-items-center rounded-md border border-[#efdad0] bg-white transition hover:border-[#ad6a6c] hover:text-[#ad6a6c] disabled:opacity-50 disabled:hover:border-[#efdad0] disabled:hover:text-[#3c232c]/60"
                >
                  <Icon icon="ph:caret-right-bold" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* COMPACT MODAL */}
        {/* ===================================================================== */}
        <AdminModal
          open={isModalOpen}
          title={form.id ? "Edit Proof" : "Create Proof"}
          description="Upload an image and set details for this portfolio entry."
          onClose={requestCloseModal}
        >
          <form onSubmit={saveItem} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <TextInput
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  required
                  placeholder="e.g. Q4 Social Media Report"
                />
              </Field>
              <Field label="Category">
                <TextInput
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  placeholder="e.g. Analytics"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_120px]">
              <Field label="Image URL (Optional)">
                <TextInput
                  value={form.image_url}
                  onChange={(e) => updateForm("image_url", e.target.value)}
                  placeholder="Paste URL or upload below"
                />
              </Field>
              <Field label="Sort Order">
                <TextInput
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(e) =>
                    updateForm(
                      "sort_order",
                      Math.max(0, Number(e.target.value)),
                    )
                  }
                  required
                />
              </Field>
            </div>

            {/* CUSTOM PREMIUM FILE UPLOAD */}
            <Field label="Upload Image">
              <div className="relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#ad6a6c]/30 bg-[#f8cdb4]/5 p-6 transition-colors hover:bg-[#f8cdb4]/10">
                <input
                  type="file"
                  accept="image/*"
                  id="proof-image-upload"
                  className="peer sr-only"
                  onChange={(event) => {
                    setImageFile(event.target.files?.[0] ?? null);
                    setIsDirty(true);
                  }}
                />
                <label
                  htmlFor="proof-image-upload"
                  className="flex cursor-pointer flex-col items-center gap-3 text-center"
                >
                  <div className="grid size-12 place-items-center rounded-full bg-white shadow-sm text-[#ad6a6c] transition-transform peer-focus:scale-110">
                    <Icon icon="ph:upload-simple-bold" className="text-xl" />
                  </div>
                  <span className="text-xs font-bold text-[#3c232c]/70">
                    {imageFile ? (
                      <span className="text-[#ad6a6c]">{imageFile.name}</span>
                    ) : (
                      "Click to browse or drag image here"
                    )}
                  </span>
                </label>
              </div>

              {/* Show current image if editing and no new file selected */}
              {(imagePreviewUrl || form.image_url) && (
                <div className="mt-3 flex items-center gap-4 rounded-xl border border-[#efdad0] bg-white/50 p-2 pr-4 shadow-sm">
                  <img
                    src={imagePreviewUrl || form.image_url}
                    alt={imagePreviewUrl ? "Selected proof preview" : "Current proof"}
                    className="size-12 rounded-lg object-cover"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                    {imagePreviewUrl ? "Selected Preview" : "Current Image"}
                  </span>
                </div>
              )}
            </Field>

            <Field label="Description">
              <TextArea
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Briefly describe the context or results of this proof..."
                rows={3}
              />
            </Field>

            {/* CUSTOM PREMIUM TOGGLE SWITCH */}
            <label className="flex cursor-pointer items-center gap-3">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={form.is_featured}
                  onChange={(e) => updateForm("is_featured", e.target.checked)}
                />
                <div className="h-6 w-11 rounded-full bg-[#e3d1d1] transition-colors peer-checked:bg-[#ad6a6c]"></div>
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#3c232c]/80 flex items-center gap-1.5">
                Feature this proof{" "}
                <Icon icon="ph:star-fill" className="text-[#ad6a6c]" />
              </span>
            </label>

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AdminButton
                type="button"
                variant="secondary"
                onClick={requestCloseModal}
                disabled={isSaving}
              >
                Cancel
              </AdminButton>
              <SaveButton disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : form.id
                    ? "Update Proof"
                    : "Create Proof"}
              </SaveButton>
            </div>
          </form>
        </AdminModal>

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete proof?"
          description={`Are you sure you want to delete "${deleteTarget?.title ?? "this proof"}"? This action cannot be undone.`}
          confirmLabel="Delete Proof"
          danger
          isLoading={isSaving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteItem}
        />

        <ConfirmModal
          open={showDiscardConfirm}
          title="Discard unsaved changes?"
          description="You have changes that are not saved yet. Are you sure you want to close without saving?"
          confirmLabel="Discard"
          danger
          onCancel={() => setShowDiscardConfirm(false)}
          onConfirm={() => {
            setShowDiscardConfirm(false);
            closeModal();
          }}
        />
      </AdminShell>
    </AdminGuard>
  );
}
