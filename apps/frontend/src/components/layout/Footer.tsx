import { useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { profile } from "../../data/site";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (profile.email) {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1800);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#efdad0] bg-[#f9f6f3] px-4 py-6 sm:px-6 lg:px-8">
      {/* BACKGROUND GLOW */}
      <div className="absolute left-[-5%] top-[-50%] -z-10 h-[200px] w-[200px] rounded-full bg-[#f8cdb4]/30 blur-[80px]" />
      <div className="absolute bottom-[-50%] right-[-5%] -z-10 h-[200px] w-[200px] rounded-full bg-[#e3d1d1]/40 blur-[80px]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT: Branding & Location */}
        <div className="flex flex-col">
          <h3 className="font-serif text-xl font-bold tracking-tight text-[#3c232c] sm:text-2xl">
            Janine Ayven Dequiros
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#3c232c]/70 sm:text-sm">
            <span className="font-medium">Virtual Assistant</span>
            <span className="hidden text-[#e3d1d1] sm:block">•</span>
            <div className="flex items-center gap-1 font-medium">
              <Icon icon="ph:map-pin-fill" className="text-sm text-[#ad6a6c]" />
              <span>Tarlac City, Philippines</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Compact Actions */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={copyEmail}
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#efdad0] bg-white/70 px-4 text-xs font-bold text-[#3c232c] shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[#ad6a6c] hover:bg-white sm:text-sm"
          >
            {copied ? (
              <Icon icon="ph:check-bold" className="text-sm text-green-500" />
            ) : (
              <Icon icon="ph:copy-bold" className="text-sm text-[#ad6a6c]" />
            )}
            <span>{copied ? "Copied!" : "Copy email"}</span>
          </motion.button>

          <div className="hidden h-5 w-px bg-[#e3d1d1] sm:block"></div>

          <div className="flex items-center gap-2">
            <SocialButton
              href={`mailto:${profile.email}`}
              icon={
                <Icon
                  icon="ph:envelope-simple-fill"
                  className="text-base text-[#ad6a6c]"
                />
              }
              label="Email"
            />
            {/* Added proper links and security attributes */}
            <SocialButton
              href="https://www.facebook.com"
              icon={<Icon icon="logos:facebook" className="text-lg" />}
              label="Facebook"
            />
            <SocialButton
              href="https://www.instagram.com/deminineinks/"
              icon={<Icon icon="skill-icons:instagram" className="text-lg" />}
              label="Instagram"
            />
            <SocialButton
              href="https://www.linkedin.com/in/janine-ayven-de-quiros-82770a3a8/"
              icon={
                <Icon icon="mdi:linkedin" className="text-lg text-[#0A66C2]" />
              }
              label="LinkedIn"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-1.5 border-t border-[#efdad0] pt-4 text-[10px] font-medium tracking-wider text-[#3c232c]/50 uppercase sm:flex-row sm:items-center sm:justify-between sm:text-[11px]">
        <p>© {new Date().getFullYear()} Janine Ayven Dequiros.</p>
        <p>Designed & developed by Allen Icee Dequiros.</p>
      </div>
    </footer>
  );
}

function SocialButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer" // Secure standard for new tabs
      aria-label={label}
      className="grid size-10 place-items-center rounded-xl border border-[#efdad0] bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[#ad6a6c] hover:bg-white"
    >
      {icon}
    </motion.a>
  );
}
