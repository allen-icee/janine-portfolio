import { useRef, useState, useEffect } from "react";
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
} from "./AdminFields";
import { AdminModal, ConfirmModal } from "./AdminModal";
import { uploadAdminImage } from "../../lib/adminUploads";
import { supabase } from "../../lib/supabase";

type PortfolioRow = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  outcome: string;
  cover_url: string;
  technologies: string[];
  sort_order: number;
  featured: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialData: PortfolioRow;
  categoryNames: string[];
  onSuccess: () => void;
};

const toSlug = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
    <div className="relative flex flex-col gap-1.5" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-11 items-center justify-between rounded-xl border bg-white px-4 text-sm shadow-sm transition-all duration-300 ${isOpen ? "border-[#ad6a6c] ring-2 ring-[#ad6a6c]/20" : "border-[#efdad0] hover:border-[#ad6a6c]/50"}`}
      >
        <span className="font-medium text-[#3c232c]">
          {value || "Select Category"}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <Icon icon="ph:caret-down-bold" className="text-sm text-[#ad6a6c]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 right-0 top-[110%] z-50 overflow-hidden rounded-xl border border-[#efdad0] bg-white p-1.5 shadow-xl"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-all ${value === opt ? "bg-[#ad6a6c]/10 font-bold text-[#ad6a6c]" : "font-medium text-[#3c232c] hover:bg-[#f8cdb4]/20"}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PortfolioProjectModal({
  open,
  onClose,
  initialData,
  categoryNames,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<PortfolioRow>(initialData);
  const [techText, setTechText] = useState(
    (initialData.technologies ?? []).join(", "),
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const updateForm = <K extends keyof PortfolioRow>(
    key: K,
    value: PortfolioRow[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleClose = () => {
    if (isDirty || imageFile) setShowDiscard(true);
    else onClose();
  };

  const saveProject = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = imageFile
        ? await uploadAdminImage(imageFile, "portfolio")
        : form.cover_url;
      const payload = {
        ...form,
        slug: form.slug || toSlug(form.title),
        cover_url: url,
        technologies: techText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const { error } = await supabase!.from("portfolio_items").upsert(payload);
      if (error) throw error;
      toast.success(form.id ? "Project updated." : "Project created.");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save project.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AdminModal
        open={open && !showDiscard}
        title={form.id ? "Edit Project" : "Create Project"}
        description="Save details and upload cover."
        onClose={handleClose}
      >
        <form onSubmit={saveProject} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <TextInput
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                required
              />
            </Field>
            <Field label="Category">
              <AdminCustomSelect
                value={form.category}
                onChange={(val) => updateForm("category", val)}
                options={categoryNames}
              />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_120px]">
            <Field label="Slug" hint="Leave blank to auto-generate.">
              <TextInput
                value={form.slug}
                onChange={(e) => updateForm("slug", e.target.value)}
                placeholder="Auto-generated"
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
                required
              />
            </Field>
          </div>
          <Field
            label="Technologies / Tools"
            hint="Comma-separated (e.g. Canva, Excel)"
          >
            <TextInput
              value={techText}
              onChange={(e) => {
                setTechText(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Canva, Excel"
            />
          </Field>
          <Field label="Cover Image URL" hint="Optional if uploading below.">
            <TextInput
              value={form.cover_url}
              onChange={(e) => updateForm("cover_url", e.target.value)}
            />
          </Field>

          <Field label="Upload Image">
            <div className="relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#ad6a6c]/30 bg-[#f8cdb4]/5 p-6 transition-colors hover:bg-[#f8cdb4]/10">
              <input
                type="file"
                accept="image/*"
                id="portfolio-upload"
                className="peer sr-only"
                onChange={(e) => {
                  setImageFile(e.target.files?.[0] ?? null);
                  setIsDirty(true);
                }}
              />
              <label
                htmlFor="portfolio-upload"
                className="flex cursor-pointer flex-col items-center gap-3 text-center"
              >
                <div className="grid size-12 place-items-center rounded-full bg-white shadow-sm text-[#ad6a6c] transition-transform peer-focus:scale-110">
                  <Icon icon="ph:upload-simple-bold" className="text-xl" />
                </div>
                <span className="text-xs font-bold text-[#3c232c]/70">
                  {imageFile ? (
                    <span className="text-[#ad6a6c]">{imageFile.name}</span>
                  ) : (
                    "Click to browse"
                  )}
                </span>
              </label>
            </div>
            {form.cover_url && !imageFile && (
              <div className="mt-3 flex items-center gap-4 rounded-xl border border-[#efdad0] bg-white/50 p-2 pr-4 shadow-sm">
                <img
                  src={form.cover_url}
                  alt="Current"
                  className="size-12 rounded-lg object-cover"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                  Current Image
                </span>
              </div>
            )}
          </Field>

          <Field label="Summary (Short)">
            <TextArea
              value={form.summary}
              onChange={(e) => updateForm("summary", e.target.value)}
              rows={2}
              required
            />
          </Field>
          <Field label="Full Description">
            <TextArea
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              rows={3}
            />
          </Field>
          <Field label="Outcome / Results">
            <TextArea
              value={form.outcome}
              onChange={(e) => updateForm("outcome", e.target.value)}
              rows={2}
            />
          </Field>

          <label className="flex cursor-pointer items-center gap-3">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={form.featured}
                onChange={(e) => updateForm("featured", e.target.checked)}
              />
              <div className="h-6 w-11 rounded-full bg-[#e3d1d1] transition-colors peer-checked:bg-[#ad6a6c]"></div>
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"></div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#3c232c]/80 flex items-center gap-1.5">
              Feature Project{" "}
              <Icon icon="ph:star-fill" className="text-[#ad6a6c]" />
            </span>
          </label>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </AdminButton>
            <SaveButton disabled={isSaving}>
              {isSaving ? "Saving..." : form.id ? "Update Item" : "Create Item"}
            </SaveButton>
          </div>
        </form>
      </AdminModal>

      <ConfirmModal
        open={showDiscard}
        title="Discard unsaved changes?"
        description="You have unsaved changes."
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
