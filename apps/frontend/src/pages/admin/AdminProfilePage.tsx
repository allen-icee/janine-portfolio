import { useEffect, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type { ExperienceItem } from "../../types/content";

interface ProfileSettings {
  id?: string;
  email_primary?: string;
  email_secondary?: string;
  phone_primary?: string;
  phone_secondary?: string;
  facebook_url?: string;
  instagram_url?: string;
  location?: string;
}

export function AdminProfilePage() {
  const [loading, setLoading] = useState(true);

  // Contacts State
  const [savingContacts, setSavingContacts] = useState(false);
  const [contacts, setContacts] = useState<ProfileSettings | null>(null);

  // Experiences State
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [addingExp, setAddingExp] = useState(false);

  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    location: "",
    duration: "",
    details: "",
    sort_order: 0,
  });

  // FIXED EFFECT
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!isSupabaseConfigured || !supabase) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const [contactRes, expRes] = await Promise.all([
          supabase.from("profile_settings").select("*").limit(1).single(),

          supabase
            .from("experience_items")
            .select("*")
            .order("sort_order", { ascending: true }),
        ]);

        if (!mounted) return;

        if (contactRes.data) {
          setContacts(contactRes.data);
        }

        if (expRes.data) {
          setExperiences(expRes.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  // --- HANDLERS FOR CONTACTS ---
  const handleSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contacts?.id || !supabase) return;

    setSavingContacts(true);

    const { error } = await supabase
      .from("profile_settings")
      .update({
        email_primary: contacts.email_primary,
        email_secondary: contacts.email_secondary,
        phone_primary: contacts.phone_primary,
        phone_secondary: contacts.phone_secondary,
        facebook_url: contacts.facebook_url,
        instagram_url: contacts.instagram_url,
        location: contacts.location,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contacts.id);

    setSavingContacts(false);

    if (error) {
      toast.error("Failed to save contacts");
    } else {
      toast.success("Contacts updated!");
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (contacts) {
      setContacts({
        ...contacts,
        [e.target.name]: e.target.value,
      });
    }
  };

  // --- HANDLERS FOR EXPERIENCE ---
  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) return;

    setAddingExp(true);

    const detailsArray = expForm.details
      .split("\n")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const { error } = await supabase.from("experience_items").insert({
      company: expForm.company,
      role: expForm.role,
      location: expForm.location,
      duration: expForm.duration,
      details: detailsArray,
      sort_order: expForm.sort_order,
    });

    setAddingExp(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Added to Journey!");

      setExpForm({
        company: "",
        role: "",
        location: "",
        duration: "",
        details: "",
        sort_order: 0,
      });

      const { data } = await supabase
        .from("experience_items")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data) {
        setExperiences(data);
      }
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!supabase) return;

    if (!window.confirm("Delete this experience?")) return;

    const { error } = await supabase
      .from("experience_items")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted");

      const { data } = await supabase
        .from("experience_items")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data) {
        setExperiences(data);
      }
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#efdad0] border-t-[#ad6a6c]" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#3c232c]">
          Profile Settings
        </h1>

        <p className="mt-2 text-sm text-[#3c232c]/70">
          Manage your contact details and professional journey.
        </p>
      </div>

      {/* CONTACTS */}
      <form
        onSubmit={handleSaveContacts}
        className="mb-10 rounded-[1.5rem] border border-[#efdad0] bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#3c232c]">
            Contacts, Socials & Location
          </h2>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={savingContacts}
            className="rounded-full bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90"
          >
            {savingContacts ? "Saving..." : "Save Contacts"}
          </motion.button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
              Primary Email
            </label>

            <input
              name="email_primary"
              value={contacts?.email_primary || ""}
              onChange={handleContactChange}
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2.5 text-sm outline-none focus:border-[#ad6a6c]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
              Secondary Email
            </label>

            <input
              name="email_secondary"
              value={contacts?.email_secondary || ""}
              onChange={handleContactChange}
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2.5 text-sm outline-none focus:border-[#ad6a6c]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
              Primary Phone
            </label>

            <input
              name="phone_primary"
              value={contacts?.phone_primary || ""}
              onChange={handleContactChange}
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2.5 text-sm outline-none focus:border-[#ad6a6c]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
              Secondary Phone
            </label>

            <input
              name="phone_secondary"
              value={contacts?.phone_secondary || ""}
              onChange={handleContactChange}
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2.5 text-sm outline-none focus:border-[#ad6a6c]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
              Facebook URL
            </label>

            <input
              name="facebook_url"
              value={contacts?.facebook_url || ""}
              onChange={handleContactChange}
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2.5 text-sm outline-none focus:border-[#ad6a6c]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
              Instagram URL
            </label>

            <input
              name="instagram_url"
              value={contacts?.instagram_url || ""}
              onChange={handleContactChange}
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2.5 text-sm outline-none focus:border-[#ad6a6c]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
              Location
            </label>

            <input
              name="location"
              value={contacts?.location || ""}
              onChange={handleContactChange}
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2.5 text-sm outline-none focus:border-[#ad6a6c]"
            />
          </div>
        </div>
      </form>

      {/* EXPERIENCE */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-[1.5rem] border border-[#efdad0] bg-white p-6 shadow-sm h-fit">
          <h2 className="mb-6 font-serif text-xl font-bold text-[#3c232c]">
            Add Journey Item
          </h2>

          <form onSubmit={handleAddExp} className="flex flex-col gap-4">
            <input
              required
              placeholder="Company"
              value={expForm.company}
              onChange={(e) =>
                setExpForm({
                  ...expForm,
                  company: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2 text-sm outline-none"
            />

            <input
              required
              placeholder="Role"
              value={expForm.role}
              onChange={(e) =>
                setExpForm({
                  ...expForm,
                  role: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2 text-sm outline-none"
            />

            <input
              required
              placeholder="Location"
              value={expForm.location}
              onChange={(e) =>
                setExpForm({
                  ...expForm,
                  location: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2 text-sm outline-none"
            />

            <input
              required
              placeholder="Duration"
              value={expForm.duration}
              onChange={(e) =>
                setExpForm({
                  ...expForm,
                  duration: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-2 text-sm outline-none"
            />

            <textarea
              required
              rows={4}
              placeholder="Details"
              value={expForm.details}
              onChange={(e) =>
                setExpForm({
                  ...expForm,
                  details: e.target.value,
                })
              }
              className="w-full resize-none rounded-xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-3 text-sm outline-none"
            />

            <button
              type="submit"
              disabled={addingExp}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] py-3 text-sm font-bold text-white hover:opacity-90"
            >
              {addingExp ? "Adding..." : "Add to Journey"}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="relative rounded-[1.5rem] border border-[#efdad0] bg-white p-5 shadow-sm"
            >
              <button
                onClick={() => handleDeleteExp(exp.id!)}
                className="absolute right-4 top-4 text-[#ad6a6c] hover:text-red-600"
              >
                <Icon icon="ph:trash-duotone" className="text-xl" />
              </button>

              <div className="pr-8">
                <h3 className="font-serif text-xl font-bold text-[#3c232c]">
                  {exp.company}
                </h3>

                <p className="text-sm font-bold text-[#ad6a6c]">{exp.role}</p>

                <div className="mt-2 flex gap-4 text-xs font-bold uppercase tracking-wider text-[#3c232c]/60">
                  <span className="flex items-center gap-1">
                    <Icon icon="ph:map-pin-duotone" />
                    {exp.location}
                  </span>

                  <span className="flex items-center gap-1">
                    <Icon icon="ph:calendar-duotone" />
                    {exp.duration}
                  </span>
                </div>

                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[#3c232c]/80 marker:text-[#ad6a6c]">
                  {exp.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
