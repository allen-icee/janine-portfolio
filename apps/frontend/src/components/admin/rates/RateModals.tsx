// apps\frontend\src\components\admin\rates\RateModals.tsx

import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { Icon } from "@iconify/react";
import { AdminModal } from "../AdminModal";
import {
  AdminButton,
  Field,
  SaveButton,
  TextArea,
  TextInput,
} from "../AdminFields";
import type { CategoryRow, GroupRow, RateRow } from "../../../types/adminRates";

export function CategoryModal({
  open,
  form,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  form: CategoryRow;
  isSaving: boolean;
  onChange: (form: CategoryRow) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <AdminModal
      open={open}
      title={form.id ? "Edit Category" : "Create Category"}
      description="Categories act as the main tabs on your public Rates page."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-[1fr_120px]">
          <Field label="Title" hint="e.g., General Services, Research">
            <TextInput
              value={form.title}
              onChange={(event) =>
                onChange({ ...form, title: event.target.value })
              }
              required
              placeholder="Enter category title..."
            />
          </Field>
          <Field label="Display Order" hint="0 appears first.">
            <TextInput
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(event) =>
                onChange({
                  ...form,
                  sort_order: Math.max(0, Number(event.target.value)),
                })
              }
              required
              placeholder="0"
            />
          </Field>
        </div>
        <Field
          label="Icon Name"
          hint="Use Iconify format (e.g., ph:books-duotone)."
        >
          <TextInput
            value={form.icon_name}
            onChange={(event) =>
              onChange({ ...form, icon_name: event.target.value })
            }
            placeholder="ph:currency-circle-dollar-duotone"
          />
        </Field>
        <Field
          label="Description"
          hint="A short summary of what this category covers."
        >
          <TextArea
            value={form.description}
            onChange={(event) =>
              onChange({ ...form, description: event.target.value })
            }
            placeholder="Write a brief public-facing description here..."
            rows={3}
          />
        </Field>
        <Field
          label="Important Note"
          hint="Displayed prominently below the category."
        >
          <TextArea
            value={form.note}
            onChange={(event) =>
              onChange({ ...form, note: event.target.value })
            }
            placeholder="e.g., Rates may vary depending on the required format..."
            rows={2}
          />
        </Field>
        <Field
          label="Package Inclusions"
          hint="Press Enter to separate items. These show as a feature list."
        >
          <TextArea
            value={form.inclusions.join("\n")}
            onChange={(event) =>
              onChange({
                ...form,
                inclusions: event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Defense Presentation Slides&#10;Unlimited Revisions&#10;Expert Guidance"
            rows={5}
          />
        </Field>
        <ActiveToggle
          checked={form.is_active}
          onChange={(checked) => onChange({ ...form, is_active: checked })}
        />
        <ModalActions isSaving={isSaving} onClose={onClose} />
      </form>
    </AdminModal>
  );
}

export function GroupModal({
  open,
  form,
  categories,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  form: GroupRow;
  categories: CategoryRow[];
  isSaving: boolean;
  onChange: (form: GroupRow) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <AdminModal
      open={open}
      title={form.id ? "Edit Service Group" : "Create Service Group"}
      description="Service Groups organize individual rates inside a Category."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="grid gap-5">
        <Field
          label="Parent Category"
          hint="Select which tab this group belongs to."
        >
          <CustomSelect
            value={form.category_id}
            placeholder="Select a category..."
            options={categories.map((c) => ({
              label: c.title,
              value: c.id || "",
            }))}
            onChange={(value) => onChange({ ...form, category_id: value })}
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-[1fr_120px]">
          <Field label="Group Title" hint="e.g., Video Editing, Chapter 1">
            <TextInput
              value={form.title}
              onChange={(event) =>
                onChange({ ...form, title: event.target.value })
              }
              required
              placeholder="Enter service group title..."
            />
          </Field>
          <Field label="Display Order" hint="0 appears first.">
            <TextInput
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(event) =>
                onChange({
                  ...form,
                  sort_order: Math.max(0, Number(event.target.value)),
                })
              }
              required
              placeholder="0"
            />
          </Field>
        </div>
        <Field
          label="Description"
          hint="Optional subtitle for this specific group."
        >
          <TextArea
            value={form.description}
            onChange={(event) =>
              onChange({ ...form, description: event.target.value })
            }
            placeholder="Optional short description..."
            rows={2}
          />
        </Field>
        <Field label="Group Note" hint="Reminders specific to these services.">
          <TextArea
            value={form.note}
            onChange={(event) =>
              onChange({ ...form, note: event.target.value })
            }
            placeholder="e.g., You can only avail of one bundle per transaction..."
            rows={2}
          />
        </Field>
        <ActiveToggle
          checked={form.is_active}
          onChange={(checked) => onChange({ ...form, is_active: checked })}
        />
        <ModalActions isSaving={isSaving} onClose={onClose} />
      </form>
    </AdminModal>
  );
}

export function RateModal({
  open,
  form,
  groups,
  categories,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  form: RateRow;
  groups: GroupRow[];
  categories: CategoryRow[];
  isSaving: boolean;
  onChange: (form: RateRow) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );

  return (
    <AdminModal
      open={open}
      title={form.id ? "Edit Rate" : "Create Rate"}
      description="A specific service and its price."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="grid gap-5">
        <Field
          label="Service Group"
          hint="Select the exact group this rate falls under."
        >
          <CustomSelect
            value={form.group_id}
            placeholder="Select a service group..."
            options={groups.map((g) => ({
              label: `${categoryById.get(g.category_id)?.title ?? "Uncategorized"} / ${g.title}`,
              value: g.id || "",
            }))}
            onChange={(value) => onChange({ ...form, group_id: value })}
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-[1fr_140px_100px]">
          <Field label="Service Name" hint="e.g., Essay (500 words)">
            <TextInput
              value={form.name}
              onChange={(event) =>
                onChange({ ...form, name: event.target.value })
              }
              required
              placeholder="Name of service..."
            />
          </Field>
          <Field label="Rate / Price" hint="Include currency symbol.">
            <TextInput
              value={form.rate_text}
              onChange={(event) =>
                onChange({ ...form, rate_text: event.target.value })
              }
              required
              placeholder="₱250.00"
            />
          </Field>
          <Field label="Order" hint="Priority.">
            <TextInput
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(event) =>
                onChange({
                  ...form,
                  sort_order: Math.max(0, Number(event.target.value)),
                })
              }
              required
              placeholder="0"
            />
          </Field>
        </div>
        <ActiveToggle
          checked={form.is_active}
          onChange={(checked) => onChange({ ...form, is_active: checked })}
        />
        <ModalActions isSaving={isSaving} onClose={onClose} />
      </form>
    </AdminModal>
  );
}

function CustomSelect({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        required
        value={value}
        onChange={() => {}}
        className="absolute bottom-0 left-1/2 -z-10 h-0 w-0 opacity-0"
        tabIndex={-1}
      />

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
            selectedOption ? "text-[#3c232c]" : "text-[#3c232c]/50"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon
          icon="ph:caret-down-bold"
          className={`shrink-0 text-[#ad6a6c]/70 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[#efdad0] bg-white p-1.5 shadow-xl outline-none backdrop-blur-md [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#efdad0] [&::-webkit-scrollbar-track]:bg-transparent">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#3c232c]/50">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  value === option.value
                    ? "bg-[#ad6a6c]/10 font-bold text-[#ad6a6c]"
                    : "text-[#3c232c] hover:bg-[#efdad0]/40"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && (
                  <Icon
                    icon="ph:check-bold"
                    className="ml-auto shrink-0 text-base text-[#ad6a6c]"
                  />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ActiveToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-3">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <div className="h-6 w-11 rounded-full bg-[#e3d1d1] transition-colors peer-checked:bg-[#ad6a6c]"></div>
        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"></div>
      </div>
      <span className="text-[11px] font-bold uppercase tracking-widest text-[#3c232c]/80">
        Active on public website
      </span>
    </label>
  );
}

function ModalActions({
  isSaving,
  onClose,
}: {
  isSaving: boolean;
  onClose: () => void;
}) {
  return (
    <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <AdminButton
        type="button"
        variant="secondary"
        onClick={onClose}
        disabled={isSaving}
        className="w-full sm:w-auto"
      >
        Cancel
      </AdminButton>
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
          ) : (
            "Save Item"
          )}
        </SaveButton>
      </div>
    </div>
  );
}
