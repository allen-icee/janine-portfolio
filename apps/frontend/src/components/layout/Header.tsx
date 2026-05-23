import { useState } from "react";
import { Icon } from "@iconify/react";

import { AdminModal } from "../ui/AdminModal";

// Navigation ordered to match LandingPage.tsx exactly
const navItems = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Proofs", href: "#proofs" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [imageError, setImageError] = useState(false);

  const [clickCount, setClickCount] = useState(0);

  const [adminOpen, setAdminOpen] = useState(false);

  // Secret admin trigger
  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const newCount = clickCount + 1;

    setClickCount(newCount);

    if (newCount >= 5) {
      setAdminOpen(true);
      setClickCount(0);
    }

    setTimeout(() => setClickCount(0), 2000);
  };

  // Smooth scroll handler
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();

    const element = document.querySelector(href);

    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full px-4 pt-4 transition-all duration-300 sm:px-6 lg:px-8">
        {/* TOP GRADIENT */}
        <div className="pointer-events-none absolute inset-0 -z-10 h-28 bg-gradient-to-b from-[#f9f6f3] to-transparent opacity-90" />

        {/* CONTAINER */}
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-[#efdad0] bg-white/70 px-4 shadow-sm backdrop-blur-xl">
          {/* BRAND */}
          <button
            onClick={handleSecretClick}
            className="group flex shrink-0 cursor-pointer items-center gap-3 outline-none"
            aria-label="Home"
          >
            {/* LOGO */}
            <div className="size-10 overflow-hidden rounded-full border border-[#ad6a6c]/30 bg-[#e3d1d1]/30 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
              {!imageError ? (
                <img
                  src="/src/assets/images/logo.jpeg"
                  alt="Janine Logo"
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif font-bold text-[#3c232c]">
                  J
                </div>
              )}
            </div>

            {/* TEXT */}
            <div className="flex flex-col items-start justify-center text-left">
              <span className="bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] bg-clip-text text-sm font-bold tracking-wide text-transparent transition-transform duration-300 group-hover:scale-[1.02]">
                JaneDesk
              </span>

              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/80">
                Janine Ayven Dequiros
              </span>
            </div>
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="group relative text-sm font-bold tracking-wide text-[#3c232c]/70 transition-colors hover:text-[#ad6a6c]"
              >
                {item.label}

                <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 rounded-full bg-[#ad6a6c] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* DESKTOP ACTION */}
          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "#contact")}
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] px-6 py-2.5 text-sm font-bold tracking-wide text-white shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg"
            >
              <Icon
                icon="ph:paper-plane-tilt-fill"
                className="text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              Get in Touch
            </a>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="grid size-10 place-items-center rounded-xl border border-[#efdad0] bg-white/60 text-[#3c232c] transition-colors hover:bg-white lg:hidden"
            aria-label="Toggle navigation"
          >
            <Icon
              icon={isMobileMenuOpen ? "ph:x-bold" : "ph:list-bold"}
              className="text-xl"
            />
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="mx-auto mt-2 max-w-7xl rounded-[1.5rem] border border-[#efdad0] bg-white/95 p-5 shadow-xl backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className="rounded-xl px-4 py-3 text-sm font-bold tracking-wide text-[#3c232c] transition hover:bg-[#f8cdb4]/20 hover:text-[#ad6a6c]"
                >
                  {item.label}
                </a>
              ))}

              <div className="my-2 h-px w-full bg-[#e3d1d1]/50" />

              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] px-4 py-3.5 text-sm font-bold tracking-wide text-white transition hover:opacity-90"
              >
                <Icon icon="ph:paper-plane-tilt-fill" className="text-lg" />
                Get in Touch
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* ADMIN MODAL */}
      <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  );
}
