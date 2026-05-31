// apps\frontend\src\components\admin\AdminShell.tsx
import { ExternalLink, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { setAdminAccessCache } from "../../lib/adminAccess";

type AdminShellProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Portfolio", href: "/admin/portfolio" },
  { label: "Rates", href: "/admin/rates" },
  { label: "Proofs", href: "/admin/proofs" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "FAQs", href: "/admin/faqs" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Profile Settings", href: "/admin/profile" },
];

export function AdminShell({ children, title, description }: AdminShellProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setAdminAccessCache(null);
    navigate("/admin/login");
  };

  return (
    <main className="min-h-screen bg-[#f9f6f3] text-[#3c232c]">
      <header className="sticky top-0 z-40 w-full px-4 pt-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-[#f9f6f3] via-[#f9f6f3]/95 to-transparent" />

        <div className="relative mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 rounded-2xl border border-[#efdad0] bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl">
          <Link
            to="/admin/dashboard"
            className="group flex min-w-0 flex-1 items-center gap-3 pr-2"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-full border border-[#ad6a6c]/30 bg-[#e3d1d1]/30 text-[#ad6a6c] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
              <ShieldCheck size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] bg-clip-text text-sm font-bold tracking-wide text-transparent">
                  {title || "JaneDesk"}
                </span>
                <span className="shrink-0 rounded-full bg-[#f8cdb4]/35 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                  Admin
                </span>
              </div>
              <p className="hidden truncate text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/70 sm:block">
                {description || "Content Management"}
              </p>
            </div>
          </Link>

          <nav className="hidden shrink-0 items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `group relative text-[13px] font-bold tracking-wide transition-colors ${
                    isActive
                      ? "text-[#ad6a6c]"
                      : "text-[#3c232c]/70 hover:text-[#ad6a6c]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-[#ad6a6c] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-full border border-[#efdad0] bg-white/60 px-4 py-2.5 text-xs font-bold tracking-wide text-[#3c232c]/75 transition-all hover:border-[#ad6a6c] hover:bg-white hover:text-[#ad6a6c]"
            >
              <ExternalLink size={14} /> View Site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="grid size-10 place-items-center rounded-xl border border-[#efdad0] bg-white/60 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mx-auto mt-2 max-w-7xl rounded-[1.5rem] border border-[#efdad0] bg-white/95 p-5 shadow-xl backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-bold ${
                      isActive
                        ? "bg-[#f8cdb4]/25 text-[#ad6a6c]"
                        : "text-[#3c232c]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="my-2 h-px w-full bg-[#efdad0]" />

              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[#3c232c] hover:bg-[#f8cdb4]/25 hover:text-[#ad6a6c] transition-colors"
              >
                <ExternalLink size={18} /> View Site
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={18} /> Sign out
              </button>
            </nav>
          </div>
        )}
      </header>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </section>
    </main>
  );
}
