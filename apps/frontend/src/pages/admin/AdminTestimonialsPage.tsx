import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { AdminGuard } from "../../components/admin/AdminGuard";
import { ConfirmModal } from "../../components/admin/AdminModal";
import { AdminShell } from "../../components/admin/AdminShell";
import { supabase } from "../../lib/supabase";

type TestimonialRow = {
  id?: string;
  client_name: string;
  service: string;
  preview: string;
  feedback: string;
  rating: number;
  project_type: string;
  feedback_date: string;
  is_verified: boolean;
  is_approved: boolean;
};

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadItems = async () => {
    const { data, error } = await supabase!
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
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
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

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
  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.client_name.toLowerCase().includes(q) ||
      item.service.toLowerCase().includes(q) ||
      item.feedback.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && item.is_approved) ||
      (statusFilter === "pending" && !item.is_approved);

    return matchesSearch && matchesStatus;
  });

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

  const deleteItem = async () => {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);

    const { error } = await supabase!
      .from("testimonials")
      .delete()
      .eq("id", deleteTarget.id);
    setIsDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Client feedback removed.");
    setDeleteTarget(null);
    await loadItems();
  };

  const updateApproval = async (item: TestimonialRow, isApproved: boolean) => {
    if (!item.id) return;

    setUpdatingId(item.id);

    const { error } = await supabase!
      .from("testimonials")
      .update({
        is_approved: isApproved,
        is_verified: isApproved,
      })
      .eq("id", item.id);

    setUpdatingId(null);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(isApproved ? "Feedback published." : "Feedback hidden.");
    await loadItems();
  };

  return (
    <AdminGuard>
      <AdminShell
        title="Client Feedback"
        description="Review testimonials and remove entries that should no longer appear publicly."
      >
        {/* ===================================================================== */}
        {/* COMPACT DATA TABLE */}
        {/* ===================================================================== */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-sm">
            <Icon
              icon="ph:magnifying-glass-bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ad6a6c]"
            />
            <input
              type="text"
              placeholder="Search by client or service..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-xl border border-[#efdad0] bg-white/60 pl-10 pr-4 text-sm text-[#3c232c] outline-none transition focus:border-[#ad6a6c] focus:bg-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
            ].map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => {
                  setStatusFilter(status.value as typeof statusFilter);
                  setCurrentPage(1);
                }}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                  statusFilter === status.value
                    ? "border-[#ad6a6c] bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] text-white shadow-md"
                    : "border-[#efdad0] bg-white/60 text-[#3c232c]/70 hover:border-[#ad6a6c] hover:bg-white"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] border border-[#efdad0] bg-white/60 shadow-sm backdrop-blur-md">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#efdad0]/60 bg-white/40 text-[10px] uppercase tracking-widest text-[#ad6a6c]">
                <tr>
                  <th className="px-5 py-4 font-bold">Client</th>
                  <th className="hidden px-5 py-4 font-bold md:table-cell">
                    Details
                  </th>
                  <th className="px-5 py-4 font-bold">Rating</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="hidden px-5 py-4 font-bold lg:table-cell">
                    Feedback
                  </th>
                  <th className="px-5 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efdad0]/40">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-xs font-medium text-[#3c232c]/50"
                    >
                      {searchQuery
                        ? "No testimonials match your search."
                        : "No testimonials found."}
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-white/50"
                    >
                      {/* Client Name & Verification */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 font-bold text-[#3c232c]">
                          {item.client_name}
                          {item.is_verified && (
                            <span
                              title="Verified Client"
                              className="inline-flex"
                            >
                              <Icon
                                icon="ph:seal-check-fill"
                                className="text-sm text-[#ad6a6c]"
                              />
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-[11px] font-medium text-[#3c232c]/60 md:hidden">
                          {item.service}
                        </div>
                      </td>

                      {/* Details (Service & Date) */}
                      <td className="hidden px-5 py-3.5 md:table-cell">
                        <div className="font-semibold text-[#ad6a6c]">
                          {item.service}
                        </div>
                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3c232c]/50">
                          {item.feedback_date || "No date"}
                        </div>
                      </td>

                      {/* Rating (Stars) */}
                      <td className="px-5 py-3.5">
                        <div className="flex gap-0.5 text-[#ad6a6c]">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Icon
                              key={index}
                              icon={
                                index < item.rating ? "ph:star-fill" : "ph:star"
                              }
                              className="text-sm"
                            />
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            item.is_approved
                              ? "bg-[#ad6a6c]/10 text-[#ad6a6c]"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.is_approved ? "Published" : "Pending"}
                        </span>
                      </td>

                      {/* Truncated Feedback */}
                      <td className="hidden px-5 py-3.5 lg:table-cell">
                        <p className="max-w-[300px] truncate text-xs font-medium text-[#3c232c]/70">
                          "{item.feedback}"
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() =>
                              updateApproval(item, !item.is_approved)
                            }
                            disabled={updatingId === item.id}
                            className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] transition-colors hover:bg-[#ad6a6c]/10 disabled:opacity-50"
                            title={
                              item.is_approved
                                ? "Hide Feedback"
                                : "Publish Feedback"
                            }
                          >
                            <Icon
                              icon={
                                item.is_approved
                                  ? "ph:eye-slash-bold"
                                  : "ph:check-circle-bold"
                              }
                              className="text-base"
                            />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] transition-colors hover:bg-red-500/10 hover:text-red-600"
                            title="Delete Feedback"
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
        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Remove feedback?"
          description={`This will permanently remove "${
            deleteTarget?.client_name ?? "this client"
          }" from your public testimonials.`}
          confirmLabel="Remove Feedback"
          danger
          isLoading={isDeleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteItem}
        />
      </AdminShell>
    </AdminGuard>
  );
}
