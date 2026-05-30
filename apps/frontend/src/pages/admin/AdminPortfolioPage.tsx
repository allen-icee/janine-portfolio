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

export function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioRow[]>([]);
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>([]);

  // UI & Target States
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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
  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / itemsPerPage),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage; // Restored startIndex!
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage,
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
                  setCurrentPage(1);
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
          <div className="flex flex-wrap gap-2 lg:shrink-0">
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
                      className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] hover:bg-[#ad6a6c]/10"
                    >
                      <Icon icon="ph:pencil-simple-bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryDeleteTarget(category)}
                      className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] hover:bg-red-500/10 hover:text-red-600"
                    >
                      <Icon icon="ph:trash-bold" />
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
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-xl border border-[#efdad0] bg-white/60 pl-10 pr-4 text-sm outline-none focus:border-[#ad6a6c]"
          />
        </div>

        {/* Projects Table */}
        <div className="overflow-hidden rounded-[1.5rem] border border-[#efdad0] bg-white/60 shadow-sm backdrop-blur-md">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/40 text-[10px] uppercase tracking-widest text-[#ad6a6c] border-b border-[#efdad0]/60">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4 hidden md:table-cell">Technologies</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efdad0]/40">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-xs font-medium text-[#3c232c]/50"
                    >
                      No projects match.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/50">
                      <td className="p-4">
                        <div className="font-bold text-[#3c232c] max-w-[200px] truncate">
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ad6a6c]">
                          {item.category} • Order: {item.sort_order}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
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
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${item.featured ? "bg-[#ad6a6c]/10 text-[#ad6a6c]" : "bg-[#e3d1d1]/30 text-[#3c232c]/50"}`}
                        >
                          {item.featured && <Icon icon="ph:star-fill" />}
                          {item.featured ? "Featured" : "Standard"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setProjectTarget(item)}
                            className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] hover:bg-[#ad6a6c]/10"
                          >
                            <Icon
                              icon="ph:pencil-simple-bold"
                              className="text-base"
                            />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] hover:bg-red-500/10 hover:text-red-600"
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#efdad0]/60 px-5 py-3 text-xs font-bold text-[#3c232c]/60">
              <span>
                {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredItems.length)} of{" "}
                {filteredItems.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="grid size-7 place-items-center rounded-md border border-[#efdad0] bg-white disabled:opacity-50"
                >
                  <Icon icon="ph:caret-left-bold" />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safeCurrentPage === totalPages}
                  className="grid size-7 place-items-center rounded-md border border-[#efdad0] bg-white disabled:opacity-50"
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
