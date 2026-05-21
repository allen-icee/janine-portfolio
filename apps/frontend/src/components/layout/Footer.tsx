import { useState } from "react";
import { Copy, Check, Mail, MapPin } from "lucide-react";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { profile } from "../../data/site";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#eadfd8] bg-[#f9f6f3] px-4 py-6 sm:px-6 lg:px-8">
      {/* BACKGROUND GLOW */}

      <div className="absolute left-[-10%] top-[-50%] -z-10 h-[250px] w-[250px] rounded-full bg-[#f8cdb4]/30 blur-[90px]" />

      <div className="absolute bottom-[-60%] right-[-10%] -z-10 h-[250px] w-[250px] rounded-full bg-[#e3d1d1]/40 blur-[100px]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}

        <div className="flex flex-col">
          <h3 className="font-serif text-xl font-bold tracking-tight text-[#3c232c]">
            {profile.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#3c232c]/60">
            <span>{profile.title}</span>

            <span className="hidden text-[#d6c6be] sm:block">•</span>

            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-[#ad6a6c]" />

              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex flex-wrap items-center gap-2">
          {/* COPY EMAIL */}

          <motion.button
            whileHover={{
              y: -1,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={copyEmail}
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 text-sm font-medium text-[#3c232c] shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[#ad6a6c]/30 hover:bg-white"
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} className="text-[#ad6a6c]" />
            )}

            <span>{copied ? "Copied" : "Copy email"}</span>
          </motion.button>

          {/* EMAIL */}

          <SocialButton
            href={`mailto:${profile.email}`}
            icon={<Mail size={17} className="text-[#ad6a6c]" />}
            label="Email"
          />

          {/* FACEBOOK */}

          <SocialButton
            href="https://facebook.com"
            icon={
              <Icon
                icon="ic:baseline-facebook"
                className="text-[18px] text-[#1877F2]"
              />
            }
            label="Facebook"
          />

          {/* INSTAGRAM */}

          <SocialButton
            href="https://instagram.com"
            icon={
              <Icon
                icon="mdi:instagram"
                className="text-[18px] text-[#E1306C]"
              />
            }
            label="Instagram"
          />

          {/* LINKEDIN */}

          <SocialButton
            href="https://linkedin.com"
            icon={
              <Icon
                icon="mdi:linkedin"
                className="text-[18px] text-[#0A66C2]"
              />
            }
            label="LinkedIn"
          />
        </div>
      </div>

      {/* BOTTOM */}

      <div className="mx-auto mt-5 flex max-w-7xl flex-col gap-1 border-t border-[#eadfd8] pt-4 text-[11px] text-[#3c232c]/45 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>

        <p>Designed & developed with intention.</p>
      </div>
    </footer>
  );
}

// ============================================================================
// SOCIAL BUTTON
// ============================================================================

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
      whileHover={{
        y: -2,
      }}
      whileTap={{
        scale: 0.96,
      }}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid size-11 place-items-center rounded-2xl border border-white/70 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[#ad6a6c]/20 hover:bg-white"
    >
      {icon}
    </motion.a>
  );
}
