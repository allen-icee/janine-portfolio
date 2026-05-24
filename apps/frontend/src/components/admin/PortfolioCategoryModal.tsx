import { useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { AdminButton, Field, SaveButton, TextInput } from "./AdminFields";
import { AdminModal, ConfirmModal } from "./AdminModal";
import { supabase } from "../../lib/supabase";

type CategoryRow = { id?: string; name: string; sort_order: number };

type Props = {
  open: boolean;
  onClose: () => void;
  initialData: CategoryRow;
  onSuccess: () => void;
};

export function PortfolioCategoryModal({
  open,
  onClose,
  initialData,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<CategoryRow>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const updateForm = <K extends keyof CategoryRow>(
    key: K,
    value: CategoryRow[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleClose = () => {
    if (isDirty) setShowDiscard(true);
    else onClose();
  };

  const saveCategory = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase!
        .from("portfolio_categories")
        .upsert(form);
      if (error) throw error;
      toast.success(form.id ? "Category updated." : "Category created.");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save category.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AdminModal
        open={open && !showDiscard}
        title={form.id ? "Edit Category" : "Create Category"}
        description="Categories become tabs for portfolio filtering."
        onClose={handleClose}
        widthClassName="max-w-xl"
      >
        <form onSubmit={saveCategory} className="grid gap-5">
          <Field label="Category Name">
            <TextInput
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              required
            />
          </Field>
          <Field label="Order">
            <TextInput
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) =>
                updateForm("sort_order", Math.max(0, Number(e.target.value)))
              }
            />
          </Field>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </AdminButton>
            <SaveButton disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : form.id
                  ? "Update Category"
                  : "Create Category"}
            </SaveButton>
          </div>
        </form>
      </AdminModal>

      <ConfirmModal
        open={showDiscard}
        title="Discard unsaved changes?"
        description="You have changes that are not saved yet."
        confirmLabel="Discard"
        danger
        onCancel={() => setShowDiscard(false)}
        onConfirm={() => {
          setShowDiscard(false);
          onClose();
        }}
      />
    </>
  );
}
