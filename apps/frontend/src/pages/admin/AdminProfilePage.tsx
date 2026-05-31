// apps\frontend\src\pages\admin\AdminProfilePage.tsx
import { useEffect, useState } from "react";
import { AdminShell } from "../../components/admin/AdminShell";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type { ExperienceItem } from "../../types/content";
import { Field, TextInput, TextArea } from "../../components/admin/AdminFields";

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

  const [savingContacts, setSavingContacts] = useState(false);
  const [contacts, setContacts] = useState<ProfileSettings | null>(null);

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
          <Field label="Primary Email">
            <TextInput
              name="email_primary"
              value={contacts?.email_primary || ""}
              onChange={handleContactChange}
              placeholder="e.g., hello@janedoe.com"
            />
          </Field>

          <Field label="Secondary Email">
            <TextInput
              name="email_secondary"
              value={contacts?.email_secondary || ""}
              onChange={handleContactChange}
              placeholder="e.g., backup@janedoe.com"
            />
          </Field>

          <Field label="Primary Phone">
            <TextInput
              name="phone_primary"
              value={contacts?.phone_primary || ""}
              onChange={handleContactChange}
              placeholder="e.g., +63 912 345 6789"
            />
          </Field>

          <Field label="Secondary Phone">
            <TextInput
              name="phone_secondary"
              value={contacts?.phone_secondary || ""}
              onChange={handleContactChange}
              placeholder="e.g., +63 998 765 4321"
            />
          </Field>

          <Field label="Facebook URL">
            <TextInput
              name="facebook_url"
              value={contacts?.facebook_url || ""}
              onChange={handleContactChange}
              placeholder="e.g., https://facebook.com/yourprofile"
            />
          </Field>

          <Field label="Instagram URL">
            <TextInput
              name="instagram_url"
              value={contacts?.instagram_url || ""}
              onChange={handleContactChange}
              placeholder="e.g., https://instagram.com/yourhandle"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Location">
              <TextInput
                name="location"
                value={contacts?.location || ""}
                onChange={handleContactChange}
                placeholder="e.g., Tarlac City, Philippines"
              />
            </Field>
          </div>
        </div>
      </form>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-[1.5rem] border border-[#efdad0] bg-white p-6 shadow-sm h-fit">
          <h2 className="mb-6 font-serif text-xl font-bold text-[#3c232c]">
            Add Journey Item
          </h2>

          <form onSubmit={handleAddExp} className="flex flex-col gap-4">
            <Field label="Company / Institution">
              <TextInput
                required
                placeholder="e.g., Infosys BPM"
                value={expForm.company}
                onChange={(e) =>
                  setExpForm({ ...expForm, company: e.target.value })
                }
              />
            </Field>

            <Field label="Role / Title">
              <TextInput
                required
                placeholder="e.g., Process Executive"
                value={expForm.role}
                onChange={(e) =>
                  setExpForm({ ...expForm, role: e.target.value })
                }
              />
            </Field>

            <Field label="Location">
              <TextInput
                required
                placeholder="e.g., SM Clark, Pampanga"
                value={expForm.location}
                onChange={(e) =>
                  setExpForm({ ...expForm, location: e.target.value })
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration">
                <TextInput
                  required
                  placeholder="e.g., Jan '25 - Feb '26"
                  value={expForm.duration}
                  onChange={(e) =>
                    setExpForm({ ...expForm, duration: e.target.value })
                  }
                />
              </Field>
              <Field label="Sort Order">
                <TextInput
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  value={expForm.sort_order}
                  onChange={(e) =>
                    setExpForm({
                      ...expForm,
                      sort_order: Math.max(0, Number(e.target.value)),
                    })
                  }
                />
              </Field>
            </div>

            <Field
              label="Details / Achievements"
              hint="Enter one achievement per line."
            >
              <TextArea
                required
                rows={4}
                placeholder="Top Agent spanning Jan 2025 until Feb 2026...&#10;Awarded Most Recognizable Agent..."
                value={expForm.details}
                onChange={(e) =>
                  setExpForm({ ...expForm, details: e.target.value })
                }
              />
            </Field>

            <button
              type="submit"
              disabled={addingExp}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] py-3 text-sm font-bold text-white hover:opacity-90 transition-all"
            >
              {addingExp ? "Adding..." : "Add to Journey"}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          {experiences.length === 0 ? (
            <div className="rounded-[1.5rem] border border-[#efdad0] bg-white/60 p-8 text-center text-sm font-medium text-[#3c232c]/50">
              No journey items found. Create one to get started.
            </div>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="relative rounded-[1.5rem] border border-[#efdad0] bg-white p-5 shadow-sm"
              >
                <button
                  onClick={() => handleDeleteExp(exp.id!)}
                  className="absolute right-4 top-4 text-[#ad6a6c] hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Icon icon="ph:trash-duotone" className="text-xl" />
                </button>

                <div className="pr-8">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl font-bold text-[#3c232c]">
                      {exp.company}
                    </h3>
                    <span className="rounded-full bg-[#f8cdb4]/35 px-2 py-0.5 text-[10px] font-bold text-[#ad6a6c]">
                      Order: {exp.sort_order}
                    </span>
                  </div>

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
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
