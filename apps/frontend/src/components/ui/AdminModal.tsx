// apps\frontend\src\components\ui\AdminModal.tsx
import { useState } from "react";
import type { FormEvent } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useNavigate } from "react-router";

import { isSupabaseConfigured, supabase } from "../../lib/supabase";

type AdminModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminModal({ open, onClose }: AdminModalProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase is not configured yet.");

      return;
    }

    setIsLoading(true);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !data.user) {
      setError("Invalid admin email or password.");

      setIsLoading(false);

      return;
    }

    const { data: adminProfile, error: adminError } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (adminError || !adminProfile) {
      await supabase.auth.signOut();

      setError("This account is not approved as an admin.");

      setIsLoading(false);

      return;
    }

    onClose();

    navigate("/admin/dashboard");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed left-1/2 top-1/2 z-[100] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-[#efdad0] bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#f8cdb4]/30 blur-3xl" />

              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#e3d1d1]/40 blur-3xl" />

              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-[#efdad0] bg-white/70 text-[#3c232c] transition hover:border-[#ad6a6c] hover:text-[#ad6a6c]"
              >
                <Icon icon="ph:x-bold" className="text-lg" />
              </button>

              <div className="relative z-10">
                <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] text-white shadow-md">
                  <Icon icon="ph:lock-key-fill" className="text-2xl" />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#ad6a6c]">
                  Restricted Access
                </p>

                <h2 className="mt-2 font-serif text-3xl font-bold text-[#3c232c]">
                  Admin Portal
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-[#3c232c]/70">
                  Sign in with your authorized administrator account.
                </p>

                {!isSupabaseConfigured && (
                  <div className="mt-5 rounded-2xl border border-[#efdad0] bg-[#f9f6f3] px-4 py-3 text-sm text-[#3c232c]/70">
                    Supabase is not configured yet.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@email.com"
                      required
                      className="h-12 rounded-xl border border-[#efdad0] bg-white/70 px-4 text-sm text-[#3c232c] outline-none transition-all duration-300 focus:border-[#ad6a6c] focus:bg-white focus:ring-2 focus:ring-[#ad6a6c]/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        required
                        className="h-12 w-full rounded-xl border border-[#efdad0] bg-white/70 px-4 pr-12 text-sm text-[#3c232c] outline-none transition-all duration-300 focus:border-[#ad6a6c] focus:bg-white focus:ring-2 focus:ring-[#ad6a6c]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3c232c]/50 hover:text-[#ad6a6c] transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <Icon icon={showPassword ? "ph:eye-slash-fill" : "ph:eye-fill"} className="text-xl" />
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <motion.button
                    whileHover={{
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    type="submit"
                    disabled={isLoading || !isSupabaseConfigured}
                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] text-sm font-bold tracking-wide text-white shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? "Checking access..." : "Enter Dashboard"}

                    <Icon
                      icon="ph:arrow-right-bold"
                      className="text-sm transition-transform group-hover:translate-x-0.5"
                    />
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
