import { useEffect, useState } from "react";
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
import { supabase } from "../../lib/supabase";

type FaqRow = {
  id?: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};

const emptyFaq: FaqRow = {
  question: "",
  answer: "",
  sort_order: 0,
  is_active: true,
};

export function AdminFaqsPage() {
  const [items, setItems] = useState<FaqRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState<FaqRow>(emptyFaq);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FaqRow | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadItems = async () => {
    const { data, error } = await supabase!
      .from("faqs")
      .select("*")
      .order("sort_order");
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems(data ?? []);
  };

  // Safe Initial Load - avoids linter warnings for cascading renders
  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      const { data, error } = await supabase!
        .from("faqs")
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
  const filteredItems = items.filter(
    (i) =>
      i.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.answer.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const updateForm = <Key extends keyof FaqRow>(
    key: Key,
    value: FaqRow[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setIsDirty(true);
  };

  const openCreate = () => {
    setForm({ ...emptyFaq, sort_order: items.length + 1 });
    setIsDirty(false);
    setIsModalOpen(true);
  };

  const openEdit = (item: FaqRow) => {
    setForm(item);
    setIsDirty(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDirty(false);
  };

  const requestCloseModal = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
      return;
    }
    closeModal();
  };

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const { error } = await supabase!.from("faqs").upsert(form);
    setIsSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(form.id ? "FAQ updated." : "FAQ created.");
    closeModal();
    await loadItems();
  };

  const deleteItem = async () => {
    if (!deleteTarget?.id) return;
    setIsSaving(true);

    const { error } = await supabase!
      .from("faqs")
      .delete()
      .eq("id", deleteTarget.id);
    setIsSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("FAQ deleted.");
    setDeleteTarget(null);
    await loadItems();
  };

  return (
    <AdminGuard>
      <AdminShell
        title="FAQs"
        description="Create, edit, reorder, publish, or remove frequently asked questions."
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Icon
              icon="ph:magnifying-glass-bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ad6a6c]"
            />
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-xl border border-[#efdad0] bg-white/60 pl-10 pr-4 text-sm text-[#3c232c] outline-none transition focus:border-[#ad6a6c] focus:bg-white"
            />
          </div>
          <AdminButton type="button" onClick={openCreate}>
            <Icon icon="ph:plus-bold" className="text-base" />
            Create FAQ
          </AdminButton>
        </div>

        {/* ===================================================================== */}
        {/* COMPACT DATA TABLE */}
        {/* ===================================================================== */}
        <div className="overflow-hidden rounded-[1.5rem] border border-[#efdad0] bg-white/60 shadow-sm backdrop-blur-md">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#efdad0]/60 bg-white/40 text-[10px] uppercase tracking-widest text-[#ad6a6c]">
                <tr>
                  <th className="w-16 px-5 py-4 font-bold">Order</th>
                  <th className="px-5 py-4 font-bold">Question</th>
                  <th className="hidden px-5 py-4 font-bold md:table-cell">
                    Answer (Preview)
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
                        ? "No FAQs match your search."
                        : "No FAQs found. Create one to get started."}
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-white/50"
                    >
                      <td className="px-5 py-3.5 font-bold text-[#3c232c]/70">
                        {item.sort_order}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-[#3c232c] max-w-[200px] truncate">
                        {item.question}
                      </td>
                      <td className="hidden px-5 py-3.5 font-medium text-[#3c232c]/60 max-w-[250px] truncate md:table-cell">
                        {item.answer}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            item.is_active
                              ? "bg-[#ad6a6c]/10 text-[#ad6a6c]"
                              : "bg-[#e3d1d1]/30 text-[#3c232c]/50"
                          }`}
                        >
                          {item.is_active ? "Active" : "Hidden"}
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
        {/* MODALS */}
        {/* ===================================================================== */}
        <AdminModal
          open={isModalOpen}
          title={form.id ? "Edit FAQ" : "Create FAQ"}
          description="Questions marked active are visible on the public site."
          onClose={requestCloseModal}
        >
          <form onSubmit={saveItem} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-[1fr_120px]">
              <Field label="Question">
                <TextInput
                  value={form.question}
                  onChange={(e) => updateForm("question", e.target.value)}
                  required
                  placeholder="e.g. What are your working hours?"
                />
              </Field>
              <Field label="Sort Order">
                <TextInput
                  type="number"
                  min="0" // Added minimum attribute constraint
                  value={form.sort_order}
                  // Added Math.max to programmatically prevent negatives
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

            <Field label="Answer">
              <TextArea
                value={form.answer}
                onChange={(e) => updateForm("answer", e.target.value)}
                required
                placeholder="Provide a clear, helpful answer..."
                rows={4}
              />
            </Field>

            {/* CUSTOM PREMIUM TOGGLE SWITCH */}
            <label className="flex cursor-pointer items-center gap-3">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={form.is_active}
                  onChange={(e) => updateForm("is_active", e.target.checked)}
                />
                <div className="h-6 w-11 rounded-full bg-[#e3d1d1] transition-colors peer-checked:bg-[#ad6a6c]"></div>
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#3c232c]/80">
                Active on public website
              </span>
            </label>

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AdminButton
                type="button"
                variant="secondary"
                onClick={requestCloseModal}
                disabled={isSaving}
              >
                Cancel
              </AdminButton>
              <SaveButton disabled={isSaving}>
                {isSaving ? "Saving..." : form.id ? "Update FAQ" : "Create FAQ"}
              </SaveButton>
            </div>
          </form>
        </AdminModal>

        {/* Delete Confirmation */}
        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete FAQ?"
          description={`Are you sure you want to delete "${deleteTarget?.question ?? "this FAQ"}"? This action cannot be undone.`}
          confirmLabel="Delete FAQ"
          danger
          isLoading={isSaving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteItem}
        />

        {/* Discard Confirmation */}
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
