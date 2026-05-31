// apps\frontend\src\pages\admin\AdminProofsPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
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

const ITEMS_PER_PAGE = 8;

const PROOF_CATEGORIES = [
  "Client Feedback",
  "Analytics & Growth",
  "Project Results",
  "Social Media Insights",
  "Certifications",
  "Other",
];

function AdminCustomSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative flex w-full flex-col" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border bg-white/70 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-[#ad6a6c]/15 ${
          isOpen
            ? "border-[#ad6a6c]"
            : "border-[#efdad0] hover:border-[#ad6a6c]"
        }`}
      >
        <span
          className={`truncate pr-4 ${
            value ? "text-[#3c232c]" : "text-[#3c232c]/50"
          }`}
        >
          {value || "Select Category"}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <Icon
            icon="ph:caret-down-bold"
            className="shrink-0 text-[#ad6a6c]/70 text-base"
          />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-60 overflow-y-auto rounded-xl border border-[#efdad0] bg-white p-1.5 shadow-xl backdrop-blur-md [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#efdad0] [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  value === opt
                    ? "bg-[#ad6a6c]/10 font-bold text-[#ad6a6c]"
                    : "text-[#3c232c] hover:bg-[#efdad0]/40"
                }`}
              >
                <span className="truncate">{opt}</span>
                {value === opt && (
                  <Icon
                    icon="ph:check-bold"
                    className="ml-auto shrink-0 text-base text-[#ad6a6c]"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminProofsPage() {
  const [items, setItems] = useState<ProofRow[]>([]);
  const [form, setForm] = useState<ProofRow>(emptyProof);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProofRow | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
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

    if (paginatedItems.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    await loadItems();
  };

  return (
    <AdminGuard>
      <AdminShell title="Proof Gallery" description="Proof Management">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
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
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-xl border border-[#efdad0] bg-white/60 pl-10 pr-4 text-sm text-[#3c232c] outline-none transition focus:border-[#ad6a6c] focus:bg-white"
            />
          </div>
          <div className="w-full sm:w-auto [&_button]:w-full">
            <AdminButton type="button" onClick={openCreate}>
              <Icon icon="ph:plus-bold" className="text-base" />
              Add Proof
            </AdminButton>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-[1.5rem] border border-[#efdad0] bg-white/60 shadow-sm backdrop-blur-md">
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
                {paginatedItems.length === 0 ? (
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
                  paginatedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-white/50"
                    >
                      <td className="px-5 py-3.5 font-bold text-[#3c232c]/70">
                        {item.sort_order}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[#3c232c] max-w-[200px] truncate">
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ad6a6c]">
                          {item.category}
                        </div>
                      </td>

                      <td className="hidden px-5 py-3.5 lg:table-cell">
                        <p className="max-w-[300px] truncate text-xs font-medium text-[#3c232c]/60 xl:max-w-[400px]">
                          {item.description}
                        </p>
                      </td>

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

          {totalItems > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#efdad0]/40 bg-white/30 px-5 py-3">
              <span className="text-[11px] font-medium text-[#3c232c]/60">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of{" "}
                {totalItems} entries
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="grid size-7 place-items-center rounded-lg border border-[#efdad0] bg-white/80 text-[#3c232c] transition hover:border-[#ad6a6c] hover:text-[#ad6a6c] disabled:pointer-events-none disabled:opacity-50"
                >
                  <Icon icon="ph:caret-left-bold" />
                </button>
                <div className="flex items-center px-2 text-xs font-bold text-[#3c232c]/70">
                  {safeCurrentPage} / {totalPages}
                </div>
                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="grid size-7 place-items-center rounded-lg border border-[#efdad0] bg-white/80 text-[#3c232c] transition hover:border-[#ad6a6c] hover:text-[#ad6a6c] disabled:pointer-events-none disabled:opacity-50"
                >
                  <Icon icon="ph:caret-right-bold" />
                </button>
              </div>
            </div>
          )}
        </div>

        <AdminModal
          open={isModalOpen}
          title={form.id ? "Edit Proof" : "Create Proof"}
          description="Upload an image and set details for this portfolio entry."
          onClose={requestCloseModal}
        >
          <form onSubmit={saveItem} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" hint="The main heading for this proof.">
                <TextInput
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  required
                  placeholder="e.g. Q4 Social Media Report"
                />
              </Field>

              <Field label="Category" hint="Groups similar proofs together.">
                <AdminCustomSelect
                  value={form.category}
                  onChange={(val) => updateForm("category", val)}
                  options={PROOF_CATEGORIES}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_120px]">
              <Field
                label="Image URL (Optional)"
                hint="Leave blank if uploading below."
              >
                <TextInput
                  value={form.image_url}
                  onChange={(e) => updateForm("image_url", e.target.value)}
                  placeholder="https://example.com/image.png"
                />
              </Field>

              <Field label="Sort Order" hint="0 is first.">
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
                  placeholder="0"
                  required
                />
              </Field>
            </div>

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

              {(imagePreviewUrl || form.image_url) && (
                <div className="mt-3 flex items-center gap-4 rounded-xl border border-[#efdad0] bg-white/50 p-2 pr-4 shadow-sm">
                  <img
                    src={imagePreviewUrl || form.image_url}
                    alt={
                      imagePreviewUrl
                        ? "Selected proof preview"
                        : "Current proof"
                    }
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

            <label className="flex w-fit cursor-pointer items-center gap-3">
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
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#3c232c]/80">
                Feature this proof{" "}
                <Icon icon="ph:star-fill" className="text-[#ad6a6c]" />
              </span>
            </label>

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <div className="w-full sm:w-auto [&_button]:w-full">
                <AdminButton
                  type="button"
                  variant="secondary"
                  onClick={requestCloseModal}
                  disabled={isSaving}
                >
                  Cancel
                </AdminButton>
              </div>
              <div className="w-full sm:w-auto [&_button]:w-full">
                <SaveButton disabled={isSaving}>
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon
                        icon="ph:spinner-gap-bold"
                        className="animate-spin text-base"
                      />
                      Saving...
                    </span>
                  ) : form.id ? (
                    "Update Proof"
                  ) : (
                    "Create Proof"
                  )}
                </SaveButton>
              </div>
            </div>
          </form>
        </AdminModal>

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete proof?"
          description={`Are you sure you want to delete "${
            deleteTarget?.title ?? "this proof"
          }"? This action cannot be undone.`}
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
