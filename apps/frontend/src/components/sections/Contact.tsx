// apps\frontend\src\components\sections\Contact.tsx
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

const services = [
  "Research Assistance",
  "Social Media Management",
  "Graphic Design",
  "Illustration",
  "Data Analytics",
  "2D Animation",
  "Documentation",
  "Others",
];

const budgets = [
  "Less than ₱ 100",
  "₱ 100 - ₱ 500",
  "₱ 500 - ₱ 1,500",
  "₱ 1,500 - ₱ 3,000",
  "₱ 3,000 - ₱ 6,000",
  "₱ 6,000+",
  "Not sure yet",
];

function CustomSelect({
  label,
  options,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative flex flex-col gap-1.5" ref={ref}>
      <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-11 items-center justify-between rounded-xl border bg-white/60 px-4 text-sm shadow-sm transition-all duration-300 ${
          isOpen
            ? "border-[#ad6a6c] ring-2 ring-[#ad6a6c]/20"
            : "border-[#efdad0] hover:border-[#ad6a6c]/50"
        }`}
      >
        <span
          className={value ? "font-medium text-[#3c232c]" : "text-[#3c232c]/50"}
        >
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon icon="ph:caret-down-bold" className="text-sm text-[#ad6a6c]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-[110%] z-50 overflow-hidden rounded-xl border border-[#efdad0] bg-white/95 p-1.5 shadow-xl backdrop-blur-xl"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                  value === option
                    ? "bg-[#ad6a6c]/10 font-bold text-[#ad6a6c]"
                    : "font-medium text-[#3c232c] hover:bg-[#f8cdb4]/20"
                }`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
interface ContactProfileSettings {
  email_primary?: string;
  email_secondary?: string;
  phone_primary?: string;
  phone_secondary?: string;
  facebook_url?: string;
  instagram_url?: string;
}

export function Contact() {
  const [profileSettings, setProfileSettings] =
    useState<ContactProfileSettings>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });

  useEffect(() => {
    async function loadSettings() {
      if (!supabase) return;
      const { data } = await supabase
        .from("profile_settings")
        .select("*")
        .limit(1)
        .single();
      if (data) setProfileSettings(data);
    }
    loadSettings();
  }, []);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("company_website")) return;

    if (!isSupabaseConfigured || !supabase) {
      toast.error("Messages are not connected yet. Please email me directly.");
      return;
    }

    setIsSending(true);
    const { error } = await supabase.from("inquiries").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      service_needed: form.service || "Not specified",
      budget_range: form.budget || "Not specified",
      message: form.message.trim(),
      source: "website",
      status: "new",
    });

    setIsSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    setSubmitted(true);
    setForm({ name: "", email: "", service: "", budget: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#f9f6f3] px-4 py-10 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="absolute -left-[5%] top-0 -z-10 h-[400px] w-[400px] rounded-full bg-[#f8cdb4]/40 blur-[100px]" />
      <div className="absolute -right-[5%] bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-[#e3d1d1]/50 blur-[120px]" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <h2 className="mt-1 font-serif text-4xl font-bold tracking-tight text-[#3c232c] sm:text-5xl">
            Contact Me
          </h2>
          <p className="mt-4 font-serif text-lg font-bold italic tracking-wide text-[#ad6a6c] sm:text-xl">
            Feel free to message me to any of my details.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-10 items-start">
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[1.5rem] border border-[#efdad0] bg-white/60 p-5 shadow-sm backdrop-blur-md"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-lg bg-[#f8cdb4]/30 text-[#ad6a6c]">
                  <Icon icon="ph:share-network-duotone" className="text-lg" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                  Social
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={profileSettings.facebook_url || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-transparent bg-white/50 px-4 py-2.5 transition-all hover:border-[#efdad0] hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Icon icon="logos:facebook" className="text-xl" />
                    <div>
                      <p className="text-sm font-bold text-[#3c232c]">
                        Facebook
                      </p>
                      <p className="text-[11px] font-medium text-[#3c232c]/60">
                        Ask Jane / Jane Deqz
                      </p>
                    </div>
                  </div>
                  <Icon
                    icon="ph:arrow-up-right-bold"
                    className="text-sm text-[#ad6a6c] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>

                <a
                  href={
                    profileSettings.instagram_url ||
                    "https://www.instagram.com/deminineinks/"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-transparent bg-white/50 px-4 py-2.5 transition-all hover:border-[#efdad0] hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Icon icon="skill-icons:instagram" className="text-xl" />
                    <div>
                      <p className="text-sm font-bold text-[#3c232c]">
                        Instagram
                      </p>
                      <p className="text-[11px] font-medium text-[#3c232c]/60">
                        @deminineinks
                      </p>
                    </div>
                  </div>
                  <Icon
                    icon="ph:arrow-up-right-bold"
                    className="text-sm text-[#ad6a6c] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-[1.5rem] border border-[#efdad0] bg-white/60 p-5 shadow-sm backdrop-blur-md"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#e3d1d1]/40 text-[#ad6a6c]">
                    <Icon icon="ph:envelope-open-duotone" className="text-lg" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                    Email
                  </p>
                </div>

                <ul className="mt-2 space-y-2.5">
                  <li className="flex items-center gap-2.5">
                    <div className="size-1.5 shrink-0 rounded-full bg-[#ad6a6c]" />
                    <span className="break-all text-sm font-bold text-[#3c232c]">
                      {profileSettings.email_primary || "janedeqz@gmail.com"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="size-1.5 shrink-0 rounded-full bg-[#ad6a6c]/40" />
                    <span className="break-all text-[12px] font-medium text-[#3c232c]/80">
                      {profileSettings.email_secondary ||
                        "janine.dequiros.18@gmail.com"}
                    </span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="rounded-[1.5rem] border border-[#efdad0] bg-white/60 p-5 shadow-sm backdrop-blur-md"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#f8cdb4]/30 text-[#ad6a6c]">
                    <Icon icon="ph:phone-call-duotone" className="text-lg" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                    Phone
                  </p>
                </div>

                <ul className="mt-2 space-y-2.5">
                  <li className="flex items-center gap-2.5">
                    <div className="size-1.5 shrink-0 rounded-full bg-[#ad6a6c]" />
                    <span className="font-serif text-[17px] font-bold tracking-wide text-[#3c232c]">
                      {profileSettings.phone_primary || "+63 991 688 1778"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="size-1.5 shrink-0 rounded-full bg-[#ad6a6c]/40" />
                    <span className="font-serif text-[15px] font-bold tracking-wide text-[#3c232c]/70">
                      {profileSettings.phone_secondary || "+63 967 278 9012"}
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                onSubmit={submitMessage}
                className="rounded-[2rem] border border-[#efdad0] bg-white/60 p-6 shadow-sm backdrop-blur-md sm:p-8"
              >
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        updateForm("name", event.target.value)
                      }
                      placeholder="Your name"
                      className="h-11 rounded-xl border border-[#efdad0] bg-white/60 px-4 text-sm text-[#3c232c] outline-none transition-all duration-300 focus:border-[#ad6a6c] focus:bg-white focus:ring-2 focus:ring-[#ad6a6c]/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateForm("email", event.target.value)
                      }
                      placeholder="you@example.com"
                      className="h-11 rounded-xl border border-[#efdad0] bg-white/60 px-4 text-sm text-[#3c232c] outline-none transition-all duration-300 focus:border-[#ad6a6c] focus:bg-white focus:ring-2 focus:ring-[#ad6a6c]/20"
                    />
                  </div>

                  <CustomSelect
                    label="Service"
                    options={services}
                    placeholder="Select service"
                    value={form.service}
                    onChange={(value) => updateForm("service", value)}
                  />
                  <CustomSelect
                    label="Budget"
                    options={budgets}
                    placeholder="Select budget"
                    value={form.budget}
                    onChange={(value) => updateForm("budget", value)}
                  />
                </div>

                <div className="mt-5 flex flex-col gap-1.5">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(event) =>
                      updateForm("message", event.target.value)
                    }
                    placeholder="Tell me about what you need..."
                    className="resize-none rounded-xl border border-[#efdad0] bg-white/60 px-4 py-3 text-sm text-[#3c232c] outline-none transition-all duration-300 focus:border-[#ad6a6c] focus:bg-white focus:ring-2 focus:ring-[#ad6a6c]/20"
                  />
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSending}
                    className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-md transition-all duration-300 hover:shadow-lg hover:opacity-90"
                  >
                    {isSending ? "Sending..." : "Send Message"}
                    <Icon
                      icon="ph:paper-plane-right-fill"
                      className="text-base transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </motion.button>
                  <p className="text-center text-xs font-medium text-[#3c232c]/60 sm:text-right">
                    Usually replies within 24 hours.
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex min-h-[440px] flex-col items-center justify-center rounded-[2rem] border border-[#efdad0] bg-white/70 px-6 text-center shadow-sm backdrop-blur-md"
              >
                <div className="mb-5 grid size-16 place-items-center rounded-full bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] text-white shadow-md">
                  <Icon icon="ph:check-bold" className="text-2xl" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#3c232c]">
                  Message Sent!
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#3c232c]/80">
                  Thank you for reaching out. I'll get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 rounded-full border border-[#efdad0] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#ad6a6c] transition-all hover:border-[#ad6a6c] hover:text-[#3c232c]"
                >
                  Send another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
