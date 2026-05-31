// apps\frontend\src\pages\admin\AdminRatesPage.tsx
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { AdminButton } from "../../components/admin/AdminFields";
import { AdminGuard } from "../../components/admin/AdminGuard";
import { ConfirmModal } from "../../components/admin/AdminModal";
import { AdminShell } from "../../components/admin/AdminShell";
import { rateCategories as defaultRateCategories } from "../../data/rates";
import { supabase } from "../../lib/supabase";

import type { CategoryRow, GroupRow, RateRow } from "../../types/adminRates";
import { emptyCategory, emptyGroup, emptyRate } from "../../types/adminRates";
import {
  CategoryModal,
  GroupModal,
  RateModal,
} from "../../components/admin/rates/RateModals";

type ActiveTab = "categories" | "services" | "rates";
type DeleteTarget =
  | { type: "category"; item: CategoryRow }
  | { type: "group"; item: GroupRow }
  | { type: "rate"; item: RateRow };

const ITEMS_PER_PAGE = 10;

export function AdminRatesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [rates, setRates] = useState<RateRow[]>([]);

  const [activeTab, setActiveTab] = useState<ActiveTab>("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [categoryForm, setCategoryForm] = useState<CategoryRow>(emptyCategory);
  const [groupForm, setGroupForm] = useState<GroupRow>(emptyGroup);
  const [rateForm, setRateForm] = useState<RateRow>(emptyRate);

  const [modalType, setModalType] = useState<ActiveTab | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  const groupById = useMemo(
    () => new Map(groups.map((group) => [group.id, group])),
    [groups],
  );

  const loadData = async () => {
    const [categoryRes, groupRes, rateRes] = await Promise.all([
      supabase!.from("rate_categories").select("*").order("sort_order"),
      supabase!.from("rate_service_groups").select("*").order("sort_order"),
      supabase!.from("rate_items").select("*").order("sort_order"),
    ]);

    if (categoryRes.error) toast.error(categoryRes.error.message);
    else
      setCategories(
        (categoryRes.data ?? []).map((category) => ({
          ...category,
          inclusions: category.inclusions ?? [],
        })),
      );

    if (groupRes.error) toast.error(groupRes.error.message);
    else setGroups(groupRes.data ?? []);

    if (rateRes.error) toast.error(rateRes.error.message);
    else setRates(rateRes.data ?? []);
  };

  useEffect(() => {
    let mounted = true;

    const fetchInitial = async () => {
      const [categoryRes, groupRes, rateRes] = await Promise.all([
        supabase!.from("rate_categories").select("*").order("sort_order"),
        supabase!.from("rate_service_groups").select("*").order("sort_order"),
        supabase!.from("rate_items").select("*").order("sort_order"),
      ]);

      if (!mounted) return;

      if (categoryRes.error) toast.error(categoryRes.error.message);
      else
        setCategories(
          (categoryRes.data ?? []).map((category) => ({
            ...category,
            inclusions: category.inclusions ?? [],
          })),
        );

      if (groupRes.error) toast.error(groupRes.error.message);
      else setGroups(groupRes.data ?? []);

      if (rateRes.error) toast.error(rateRes.error.message);
      else setRates(rateRes.data ?? []);
    };

    void fetchInitial();

    return () => {
      mounted = false;
    };
  }, []);

  const openCreate = (type: ActiveTab) => {
    if (type === "categories") {
      setCategoryForm({ ...emptyCategory, sort_order: categories.length + 1 });
    }
    if (type === "services") {
      setGroupForm({
        ...emptyGroup,
        category_id: categories[0]?.id ?? "",
        sort_order: groups.length + 1,
      });
    }
    if (type === "rates") {
      setRateForm({
        ...emptyRate,
        group_id: groups[0]?.id ?? "",
        sort_order: rates.length + 1,
      });
    }
    setModalType(type);
  };

  const closeModal = () => setModalType(null);

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    const { error } = await supabase!
      .from("rate_categories")
      .upsert(categoryForm);
    setIsSaving(false);
    if (error) return toast.error(error.message);
    toast.success(
      categoryForm.id ? "Rate category updated." : "Rate category created.",
    );
    closeModal();
    await loadData();
  };

  const saveGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    const { error } = await supabase!
      .from("rate_service_groups")
      .upsert(groupForm);
    setIsSaving(false);
    if (error) return toast.error(error.message);
    toast.success(
      groupForm.id ? "Service group updated." : "Service group created.",
    );
    closeModal();
    await loadData();
  };

  const saveRate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    const { error } = await supabase!.from("rate_items").upsert(rateForm);
    setIsSaving(false);
    if (error) return toast.error(error.message);
    toast.success(rateForm.id ? "Rate updated." : "Rate created.");
    closeModal();
    await loadData();
  };

  const deleteItem = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);

    if (deleteTarget.type === "category") {
      const used = groups.some(
        (group) => group.category_id === deleteTarget.item.id,
      );
      if (used) {
        setIsSaving(false);
        return toast.error(
          "Move or delete the service groups under this category first.",
        );
      }
      const { error } = await supabase!
        .from("rate_categories")
        .delete()
        .eq("id", deleteTarget.item.id);
      if (error) {
        setIsSaving(false);
        return toast.error(error.message);
      }
    }

    if (deleteTarget.type === "group") {
      const used = rates.some((rate) => rate.group_id === deleteTarget.item.id);
      if (used) {
        setIsSaving(false);
        return toast.error(
          "Move or delete the rates under this service group first.",
        );
      }
      const { error } = await supabase!
        .from("rate_service_groups")
        .delete()
        .eq("id", deleteTarget.item.id);
      if (error) {
        setIsSaving(false);
        return toast.error(error.message);
      }
    }

    if (deleteTarget.type === "rate") {
      const { error } = await supabase!
        .from("rate_items")
        .delete()
        .eq("id", deleteTarget.item.id);
      if (error) {
        setIsSaving(false);
        return toast.error(error.message);
      }
    }

    setIsSaving(false);
    toast.success("Deleted successfully.");
    setDeleteTarget(null);
    await loadData();
  };

  const importDefaultRates = async () => {
    setIsSeeding(true);
    try {
      for (const category of defaultRateCategories) {
        const { data: categoryData, error: categoryError } = await supabase!
          .from("rate_categories")
          .upsert(
            {
              title: category.title,
              description: category.description ?? "",
              icon_name:
                category.iconName ?? "ph:currency-circle-dollar-duotone",
              note: category.note ?? "",
              inclusions: category.inclusions ?? [],
              sort_order: category.sortOrder,
              is_active: category.isActive ?? true,
            },
            { onConflict: "title" },
          )
          .select("id")
          .single();

        if (categoryError) throw categoryError;

        for (const group of category.groups) {
          const { data: groupData, error: groupError } = await supabase!
            .from("rate_service_groups")
            .upsert(
              {
                category_id: categoryData.id,
                title: group.title,
                description: group.description ?? "",
                note: group.note ?? "",
                sort_order: group.sortOrder,
                is_active: group.isActive ?? true,
              },
              { onConflict: "category_id,title" },
            )
            .select("id")
            .single();

          if (groupError) throw groupError;

          for (const rate of group.rates) {
            const { error: rateError } = await supabase!
              .from("rate_items")
              .upsert(
                {
                  group_id: groupData.id,
                  name: rate.name,
                  rate_text: rate.rate,
                  sort_order: rate.sortOrder,
                  is_active: rate.isActive ?? true,
                },
                { onConflict: "group_id,name" },
              );

            if (rateError) throw rateError;
          }
        }
      }
      toast.success("Default rates imported.");
      await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not import rates.",
      );
    } finally {
      setIsSeeding(false);
    }
  };

  const q = searchQuery.toLowerCase();

  const filteredCategories = categories.filter((item) =>
    `${item.title} ${item.description}`.toLowerCase().includes(q),
  );
  const filteredGroups = groups.filter((item) =>
    `${item.title} ${item.description} ${categoryById.get(item.category_id)?.title ?? ""}`
      .toLowerCase()
      .includes(q),
  );
  const filteredRates = rates.filter((item) =>
    `${item.name} ${item.rate_text} ${groupById.get(item.group_id)?.title ?? ""}`
      .toLowerCase()
      .includes(q),
  );

  const getPaginatedData = <T,>(data: T[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const paginatedCategories = getPaginatedData(filteredCategories);
  const paginatedGroups = getPaginatedData(filteredGroups);
  const paginatedRates = getPaginatedData(filteredRates);

  return (
    <AdminGuard>
      <AdminShell title="Rates" description="Rates Management">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full max-w-sm">
            <Icon
              icon="ph:magnifying-glass-bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ad6a6c]"
            />
            <input
              type="text"
              placeholder="Search rates..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-xl border border-[#efdad0] bg-white/60 pl-10 pr-4 text-sm text-[#3c232c] outline-none transition focus:border-[#ad6a6c] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "Categories", value: "categories" },
              { label: "Services", value: "services" },
              { label: "Rates", value: "rates" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setActiveTab(tab.value as ActiveTab);
                  setCurrentPage(1);
                }}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                  activeTab === tab.value
                    ? "border-[#ad6a6c] bg-[#ad6a6c] text-white"
                    : "border-[#efdad0] bg-white/60 text-[#3c232c]/70 hover:border-[#ad6a6c]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={importDefaultRates}
              disabled={isSeeding}
            >
              <Icon icon="ph:download-simple-bold" className="text-base" />
              {isSeeding ? "Importing..." : "Import Defaults"}
            </AdminButton>
            <AdminButton type="button" onClick={() => openCreate(activeTab)}>
              <Icon icon="ph:plus-bold" className="text-base" />
              Add{" "}
              {activeTab === "categories"
                ? "Category"
                : activeTab === "services"
                  ? "Service"
                  : "Rate"}
            </AdminButton>
          </div>
        </div>

        {activeTab === "categories" && (
          <RatesTableShell
            empty={paginatedCategories.length === 0}
            totalItems={filteredCategories.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          >
            {paginatedCategories.map((item) => (
              <tr key={item.id} className="hover:bg-white/50">
                <td className="px-5 py-3.5">
                  <div className="font-bold text-[#3c232c]">{item.title}</div>
                  <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ad6a6c]">
                    Order {item.sort_order}
                  </div>
                </td>
                <td className="hidden px-5 py-3.5 text-xs text-[#3c232c]/62 md:table-cell">
                  {item.description || "No description"}
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill active={item.is_active} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <RowActions
                    onEdit={() => {
                      setCategoryForm(item);
                      setModalType("categories");
                    }}
                    onDelete={() => setDeleteTarget({ type: "category", item })}
                  />
                </td>
              </tr>
            ))}
          </RatesTableShell>
        )}

        {activeTab === "services" && (
          <RatesTableShell
            empty={paginatedGroups.length === 0}
            totalItems={filteredGroups.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          >
            {paginatedGroups.map((item) => (
              <tr key={item.id} className="hover:bg-white/50">
                <td className="px-5 py-3.5">
                  <div className="font-bold text-[#3c232c]">{item.title}</div>
                  <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ad6a6c]">
                    {categoryById.get(item.category_id)?.title ?? "No category"}
                  </div>
                </td>
                <td className="hidden px-5 py-3.5 text-xs text-[#3c232c]/62 md:table-cell">
                  {item.note || item.description || "No note"}
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill active={item.is_active} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <RowActions
                    onEdit={() => {
                      setGroupForm(item);
                      setModalType("services");
                    }}
                    onDelete={() => setDeleteTarget({ type: "group", item })}
                  />
                </td>
              </tr>
            ))}
          </RatesTableShell>
        )}

        {activeTab === "rates" && (
          <RatesTableShell
            empty={paginatedRates.length === 0}
            totalItems={filteredRates.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          >
            {paginatedRates.map((item) => (
              <tr key={item.id} className="hover:bg-white/50">
                <td className="px-5 py-3.5">
                  <div className="font-bold text-[#3c232c]">{item.name}</div>
                  <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ad6a6c]">
                    {groupById.get(item.group_id)?.title ?? "No service"}
                  </div>
                </td>
                <td className="hidden px-5 py-3.5 text-xs font-bold text-[#3c232c]/70 md:table-cell">
                  {item.rate_text}
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill active={item.is_active} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <RowActions
                    onEdit={() => {
                      setRateForm(item);
                      setModalType("rates");
                    }}
                    onDelete={() => setDeleteTarget({ type: "rate", item })}
                  />
                </td>
              </tr>
            ))}
          </RatesTableShell>
        )}

        <CategoryModal
          open={modalType === "categories"}
          form={categoryForm}
          isSaving={isSaving}
          onChange={setCategoryForm}
          onClose={closeModal}
          onSubmit={saveCategory}
        />
        <GroupModal
          open={modalType === "services"}
          form={groupForm}
          categories={categories}
          isSaving={isSaving}
          onChange={setGroupForm}
          onClose={closeModal}
          onSubmit={saveGroup}
        />
        <RateModal
          open={modalType === "rates"}
          form={rateForm}
          groups={groups}
          categories={categories}
          isSaving={isSaving}
          onChange={setRateForm}
          onClose={closeModal}
          onSubmit={saveRate}
        />

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete item?"
          description="This action cannot be undone."
          confirmLabel="Delete"
          danger
          isLoading={isSaving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteItem}
        />
      </AdminShell>
    </AdminGuard>
  );
}

function RatesTableShell({
  children,
  empty,
  totalItems,
  currentPage,
  onPageChange,
}: {
  children: ReactNode;
  empty: boolean;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col overflow-hidden rounded-[1.5rem] border border-[#efdad0] bg-white/60 shadow-sm backdrop-blur-md">
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#efdad0]/60 bg-white/40 text-[10px] uppercase tracking-widest text-[#ad6a6c]">
            <tr>
              <th className="px-5 py-4 font-bold">Name</th>
              <th className="hidden px-5 py-4 font-bold md:table-cell">
                Details
              </th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#efdad0]/40">
            {empty ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-xs font-medium text-[#3c232c]/50"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>

      {!empty && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#efdad0]/40 bg-white/30 px-5 py-3">
          <span className="text-[11px] font-medium text-[#3c232c]/60">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems}{" "}
            entries
          </span>
          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="grid size-7 place-items-center rounded-lg border border-[#efdad0] bg-white/80 text-[#3c232c] transition hover:border-[#ad6a6c] hover:text-[#ad6a6c] disabled:pointer-events-none disabled:opacity-50"
            >
              <Icon icon="ph:caret-left-bold" />
            </button>
            <div className="flex items-center px-2 text-xs font-bold text-[#3c232c]/70">
              {currentPage} / {totalPages}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="grid size-7 place-items-center rounded-lg border border-[#efdad0] bg-white/80 text-[#3c232c] transition hover:border-[#ad6a6c] hover:text-[#ad6a6c] disabled:pointer-events-none disabled:opacity-50"
            >
              <Icon icon="ph:caret-right-bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-end gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] transition hover:bg-[#ad6a6c]/10"
        title="Edit"
      >
        <Icon icon="ph:pencil-simple-bold" className="text-base" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] transition hover:bg-red-500/10 hover:text-red-600"
        title="Delete"
      >
        <Icon icon="ph:trash-bold" className="text-base" />
      </button>
    </div>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
        active
          ? "bg-[#ad6a6c]/10 text-[#ad6a6c]"
          : "bg-[#e3d1d1]/30 text-[#3c232c]/50"
      }`}
    >
      {active ? "Active" : "Hidden"}
    </span>
  );
}
