import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Works", href: "#portfolio" },
  { label: "Proofs", href: "#proofs" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // React-safe state for handling missing logo images
  const [imageError, setImageError] = useState(false);

  // Secret Admin Trigger Logic
  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      navigate("/admin/login");
      setClickCount(0);
    }

    // Reset the counter if they don't click 5 times fast enough
    setTimeout(() => setClickCount(0), 2000);
  };

  return (
    <header className="fixed top-4 z-50 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-[#e3d1d1] bg-[#f9f6f3]/95 px-4 backdrop-blur-xl shadow-sm">
        {/* Brand / Logo with Secret Trigger */}
        <button
          onClick={handleSecretClick}
          className="group flex shrink-0 items-center gap-3 cursor-pointer outline-none"
          aria-label="Home"
        >
          {/* Custom Logo with React-safe fallback */}
          <div className="size-10 overflow-hidden rounded-full border border-[#ad6a6c] bg-[#e3d1d1] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
            {!imageError ? (
              <img
                src="/src/assets/images/logo.jpeg" /* Replace with your actual logo path */
                alt="Janine Logo"
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-serif text-[#3c232c] font-bold">
                J
              </div>
            )}
          </div>

          {/* Stacked Name - High Contrast */}
          <div className="flex flex-col items-start justify-center text-left">
            <span className="text-sm font-bold tracking-wide text-[#ad6a6c] transition-colors duration-300 group-hover:text-[#3c232c]">
              JaneDesk
            </span>
            <span className="text-[10px] font-medium tracking-widest text-[#3c232c] uppercase">
              Janine Ayven Dequiros
            </span>
          </div>
        </button>

        {/* Desktop Navigation - High Contrast */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm font-semibold tracking-wide text-[#3c232c]/80 transition-colors hover:text-[#ad6a6c]"
            >
              {item.label}
              {/* Subtle underline hover effect */}
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-[#ad6a6c] transition-all duration-300 group-hover:w-full rounded-full"></span>
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-4 sm:flex">
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-xl bg-[#ad6a6c] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3c232c] hover:shadow-lg hover:shadow-[#3c232c]/20"
          >
            <Icon icon="ph:envelope-simple-fill" width="18" height="18" />
            Get in Touch
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="grid size-10 place-items-center rounded-xl border border-[#e3d1d1] bg-[#e3d1d1]/50 text-[#3c232c] transition-colors hover:bg-[#e3d1d1] lg:hidden"
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? (
            <Icon icon="ph:x-bold" width="22" height="22" />
          ) : (
            <Icon icon="ph:list-bold" width="22" height="22" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-[#e3d1d1] bg-[#f9f6f3]/95 p-5 backdrop-blur-2xl lg:hidden shadow-xl">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold tracking-wide text-[#3c232c] transition hover:bg-[#e3d1d1] hover:text-[#ad6a6c]"
              >
                {item.label}
              </a>
            ))}
            <hr className="my-1 border-[#e3d1d1]" />
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#ad6a6c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3c232c]"
            >
              <Icon icon="ph:envelope-simple-fill" width="18" height="18" />
              Get in Touch
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
