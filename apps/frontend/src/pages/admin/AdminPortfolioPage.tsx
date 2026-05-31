import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { AdminButton } from "../../components/admin/AdminFields";
import { AdminGuard } from "../../components/admin/AdminGuard";
import { ConfirmModal } from "../../components/admin/AdminModal";
import { AdminShell } from "../../components/admin/AdminShell";
import { supabase } from "../../lib/supabase";
import { PortfolioProjectModal } from "../../components/admin/PortfolioProjectModal";
import { PortfolioCategoryModal } from "../../components/admin/PortfolioCategoryModal";
import { deleteAdminImage } from "../../lib/adminUploads";

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

type CategoryRow = { id?: string; name: string; sort_order: number };

const emptyPortfolio: PortfolioRow = {
  title: "",
  slug: "",
  category: "Research",
  summary: "",
  description: "",
  outcome: "",
  cover_url: "",
  technologies: [],
  sort_order: 0,
  featured: false,
};

const emptyCategory: CategoryRow = { name: "", sort_order: 0 };

const ITEMS_PER_PAGE = 8;

export function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioRow[]>([]);
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>([]);

  // UI & Target States
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Modal Targets
  const [projectTarget, setProjectTarget] = useState<PortfolioRow | null>(null);
  const [categoryTarget, setCategoryTarget] = useState<CategoryRow | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<PortfolioRow | null>(null);
  const [categoryDeleteTarget, setCategoryDeleteTarget] =
    useState<CategoryRow | null>(null);

  // Safe Initial Load for linter
  useEffect(() => {
    let mounted = true;
    const fetchInitialData = async () => {
      const [itemsRes, catRes] = await Promise.all([
        supabase!.from("portfolio_items").select("*").order("sort_order"),
        supabase!.from("portfolio_categories").select("*").order("sort_order"),
      ]);
      if (mounted) {
        if (itemsRes.error) toast.error(itemsRes.error.message);
        else setItems(itemsRes.data ?? []);

        if (catRes.error) toast.error(catRes.error.message);
        else setCategoryRows(catRes.data ?? []);
      }
    };
    void fetchInitialData();
    return () => {
      mounted = false;
    };
  }, []);

  // Standard load data for refreshing after actions
  const loadData = async () => {
    const [itemsRes, categoriesRes] = await Promise.all([
      supabase!.from("portfolio_items").select("*").order("sort_order"),
      supabase!.from("portfolio_categories").select("*").order("sort_order"),
    ]);

    if (itemsRes.error) {
      toast.error(itemsRes.error.message);
    } else {
      setItems(itemsRes.data ?? []);
    }

    if (categoriesRes.error) {
      toast.error(categoriesRes.error.message);
    } else {
      setCategoryRows(categoriesRes.data ?? []);
    }
  };

  const categoryNames = useMemo(
    () => categoryRows.map((c) => c.name),
    [categoryRows],
  );

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (activeCategory !== "All")
      filtered = filtered.filter((i) => i.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          (i.technologies ?? []).some((tech) => tech.toLowerCase().includes(q)),
      );
    }
    return filtered;
  }, [activeCategory, items, searchQuery]);

  // Derived Pagination State
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const deleteProject = async () => {
    if (!deleteTarget?.id) return;
    setIsSaving(true);
    const { error } = await supabase!
      .from("portfolio_items")
      .delete()
      .eq("id", deleteTarget.id);
    setIsSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    await deleteAdminImage(deleteTarget.cover_url);
    setDeleteTarget(null);

    // Safety check: if deleting the last item on a page, go back a page
    if (paginatedItems.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    await loadData();
    toast.success("Project deleted.");
  };

  const deleteCategory = async () => {
    if (!categoryDeleteTarget?.id) return;
    const projectsUsingCategory = items.filter(
      (item) => item.category === categoryDeleteTarget.name,
    ).length;

    if (projectsUsingCategory > 0) {
      toast.error(
        `Move or edit ${projectsUsingCategory} project${
          projectsUsingCategory === 1 ? "" : "s"
        } before deleting this category.`,
      );
      setCategoryDeleteTarget(null);
      return;
    }

    setIsSaving(true);
    const { error } = await supabase!
      .from("portfolio_categories")
      .delete()
      .eq("id", categoryDeleteTarget.id);
    setIsSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (activeCategory === categoryDeleteTarget.name) setActiveCategory("All");
    setCategoryDeleteTarget(null);
    await loadData();
    toast.success("Category deleted.");
  };

  return (
    <AdminGuard>
      <AdminShell title="Portfolio" description="Project Management">
        {/* Header Controls */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {["All", ...categoryNames].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentPage(1); // Reset page on category change
                }}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                  activeCategory === category
                    ? "border-[#ad6a6c] bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] text-white shadow-md"
                    : "border-[#efdad0] bg-white/60 text-[#3c232c]/70 hover:border-[#ad6a6c] hover:bg-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:w-auto [&_button]:w-full sm:[&_button]:w-auto lg:shrink-0">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() =>
                setCategoryTarget({
                  ...emptyCategory,
                  sort_order: categoryRows.length + 1,
                })
              }
            >
              <Icon icon="ph:folder-plus-bold" className="text-base" /> Category
            </AdminButton>
            <AdminButton
              type="button"
              onClick={() =>
                setProjectTarget({
                  ...emptyPortfolio,
                  category: categoryNames[0] ?? "",
                  sort_order: items.length + 1,
                })
              }
            >
              <Icon icon="ph:plus-bold" className="text-base" /> Project
            </AdminButton>
          </div>
        </div>

        {/* Categories Grid */}
        <section className="mb-8 rounded-[1.5rem] border border-[#efdad0] bg-white/40 p-5 shadow-sm backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-serif text-lg font-bold text-[#3c232c]">
              Active Categories
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-[#ad6a6c]">
              {categoryRows.length} items
            </p>
          </div>
          {categoryRows.length === 0 ? (
            <p className="text-xs font-medium text-[#3c232c]/50">
              No categories found in the database. Create one above.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryRows.map((category) => (
                <article
                  key={category.id ?? category.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#efdad0] bg-white/70 px-4 py-3 shadow-sm hover:border-[#ad6a6c]/50 hover:bg-white"
                >
                  <div>
                    <p className="text-sm font-bold text-[#3c232c]">
                      {category.name}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#ad6a6c]">
                      Order: {category.sort_order}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setCategoryTarget(category)}
                      className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] transition-colors hover:bg-[#ad6a6c]/10"
                    >
                      <Icon
                        icon="ph:pencil-simple-bold"
                        className="text-base"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryDeleteTarget(category)}
                      className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] transition-colors hover:bg-red-500/10 hover:text-red-600"
                    >
                      <Icon icon="ph:trash-bold" className="text-base" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Search Input */}
        <div className="mb-4 relative w-full max-w-sm">
          <Icon
            icon="ph:magnifying-glass-bold"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ad6a6c]"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            className="h-10 w-full rounded-xl border border-[#efdad0] bg-white/60 pl-10 pr-4 text-sm outline-none transition focus:border-[#ad6a6c] focus:bg-white"
          />
        </div>

        {/* Projects Table */}
        <div className="flex flex-col overflow-hidden rounded-[1.5rem] border border-[#efdad0] bg-white/60 shadow-sm backdrop-blur-md">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#efdad0]/60 bg-white/40 text-[10px] uppercase tracking-widest text-[#ad6a6c]">
                <tr>
                  <th className="px-5 py-4 font-bold">Title</th>
                  <th className="hidden px-5 py-4 font-bold md:table-cell">
                    Technologies
                  </th>
                  <th className="px-5 py-4 font-bold">Featured</th>
                  <th className="px-5 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efdad0]/40">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-xs font-medium text-[#3c232c]/50"
                    >
                      {searchQuery
                        ? "No projects match your search."
                        : "No projects found."}
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-white/50"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[#3c232c] max-w-[200px] truncate">
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ad6a6c]">
                          {item.category} • Order: {item.sort_order}
                        </div>
                      </td>
                      <td className="hidden px-5 py-3.5 md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {(item.technologies ?? []).slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md bg-[#e3d1d1]/30 px-2 py-0.5 text-[10px] font-bold text-[#3c232c]/70"
                            >
                              {tech}
                            </span>
                          ))}
                          {item.technologies?.length > 3 && (
                            <span className="rounded-md px-1 py-0.5 text-[10px] font-bold text-[#ad6a6c]">
                              +{item.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            item.featured
                              ? "bg-[#ad6a6c]/10 text-[#ad6a6c]"
                              : "bg-[#e3d1d1]/30 text-[#3c232c]/50"
                          }`}
                        >
                          {item.featured && <Icon icon="ph:star-fill" />}
                          {item.featured ? "Featured" : "Standard"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setProjectTarget(item)}
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
          {/* PAGINATION CONTROLS (Standardized Style) */}
          {/* ===================================================================== */}
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

        {/* Separated Modals */}
        {projectTarget && (
          <PortfolioProjectModal
            open={!!projectTarget}
            onClose={() => setProjectTarget(null)}
            initialData={projectTarget}
            categoryNames={categoryNames}
            onSuccess={loadData}
          />
        )}

        {categoryTarget && (
          <PortfolioCategoryModal
            open={!!categoryTarget}
            onClose={() => setCategoryTarget(null)}
            initialData={categoryTarget}
            onSuccess={loadData}
          />
        )}

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete project?"
          description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
          confirmLabel="Delete"
          danger
          isLoading={isSaving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteProject}
        />
        <ConfirmModal
          open={Boolean(categoryDeleteTarget)}
          title="Delete category?"
          description={`Are you sure? Existing projects keep their category text.`}
          confirmLabel="Delete"
          danger
          isLoading={isSaving}
          onCancel={() => setCategoryDeleteTarget(null)}
          onConfirm={deleteCategory}
        />
      </AdminShell>
    </AdminGuard>
  );
}
