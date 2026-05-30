import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { AdminGuard } from "../../components/admin/AdminGuard";
import { ConfirmModal } from "../../components/admin/AdminModal";
import { AdminShell } from "../../components/admin/AdminShell";
import { supabase } from "../../lib/supabase";

type InquiryRow = {
  id?: string;
  name: string;
  email: string;
  service_needed: string;
  budget_range?: string;
  message: string;
  status: "new" | "handled" | string;
  created_at?: string;
};

export function AdminInquiriesPage() {
  const [items, setItems] = useState<InquiryRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "handled">(
    "all",
  );
  const [deleteTarget, setDeleteTarget] = useState<InquiryRow | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadItems = async () => {
    const { data, error } = await supabase!
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

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
        .from("inquiries")
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
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.service_needed.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (item: InquiryRow, status: "new" | "handled") => {
    if (!item.id) return;

    setUpdatingId(item.id);

    const { error } = await supabase!
      .from("inquiries")
      .update({ status })
      .eq("id", item.id);

    setUpdatingId(null);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      status === "handled" ? "Inquiry marked handled." : "Inquiry reopened.",
    );
    await loadItems();
  };

  const deleteItem = async () => {
    if (!deleteTarget?.id) return;

    setIsDeleting(true);

    const { error } = await supabase!
      .from("inquiries")
      .delete()
      .eq("id", deleteTarget.id);

    setIsDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Inquiry deleted.");
    setDeleteTarget(null);
    await loadItems();
  };

  return (
    <AdminGuard>
      <AdminShell title="Inquiries" description="Inquiries Management">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-sm">
            <Icon
              icon="ph:magnifying-glass-bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ad6a6c]"
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 w-full rounded-xl border border-[#efdad0] bg-white/60 pl-10 pr-4 text-sm text-[#3c232c] outline-none transition focus:border-[#ad6a6c] focus:bg-white"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { label: "All", value: "all" },
              { label: "New", value: "new" },
              { label: "Handled", value: "handled" },
            ].map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() =>
                  setStatusFilter(status.value as typeof statusFilter)
                }
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
                  <th className="px-5 py-4 font-bold">Sender</th>
                  <th className="hidden px-5 py-4 font-bold md:table-cell">
                    Request
                  </th>
                  <th className="hidden px-5 py-4 font-bold lg:table-cell">
                    Message
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
                      No inquiries found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-white/50"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[#3c232c]">
                          {item.name}
                        </div>
                        <a
                          href={`mailto:${item.email}`}
                          className="mt-0.5 block text-[11px] font-medium text-[#ad6a6c] hover:underline"
                        >
                          {item.email}
                        </a>
                      </td>
                      <td className="hidden px-5 py-3.5 md:table-cell">
                        <div className="font-semibold text-[#3c232c]">
                          {item.service_needed}
                        </div>
                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3c232c]/50">
                          {item.budget_range || "No budget"} /{" "}
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "No date"}
                        </div>
                      </td>
                      <td className="hidden px-5 py-3.5 lg:table-cell">
                        <p className="max-w-[420px] truncate text-xs font-medium text-[#3c232c]/70">
                          {item.message}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            item.status === "handled"
                              ? "bg-[#ad6a6c]/10 text-[#ad6a6c]"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status === "handled" ? "Handled" : "New"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() =>
                              updateStatus(
                                item,
                                item.status === "handled" ? "new" : "handled",
                              )
                            }
                            disabled={updatingId === item.id}
                            className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] transition-colors hover:bg-[#ad6a6c]/10 disabled:opacity-50"
                            title={
                              item.status === "handled"
                                ? "Mark New"
                                : "Mark Handled"
                            }
                          >
                            <Icon
                              icon={
                                item.status === "handled"
                                  ? "ph:arrow-counter-clockwise-bold"
                                  : "ph:check-circle-bold"
                              }
                              className="text-base"
                            />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="grid size-8 place-items-center rounded-lg text-[#ad6a6c] transition-colors hover:bg-red-500/10 hover:text-red-600"
                            title="Delete Inquiry"
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
        </div>

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete inquiry?"
          description={`This will permanently remove "${
            deleteTarget?.name ?? "this message"
          }" from inquiries.`}
          confirmLabel="Delete Inquiry"
          danger
          isLoading={isDeleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deleteItem}
        />
      </AdminShell>
    </AdminGuard>
  );
}
