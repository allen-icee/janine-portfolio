// apps\frontend\src\components\layout\Footer.tsx
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
interface FooterProfileSettings {
  email_primary?: string;
  location?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
}

export function Footer() {
  const [copied, setCopied] = useState(false);
  const [profileSettings, setProfileSettings] = useState<FooterProfileSettings>(
    {},
  );

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

  const copyEmail = async () => {
    const emailToCopy = profileSettings.email_primary || "janedeqz@gmail.com";
    await navigator.clipboard.writeText(emailToCopy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#efdad0] bg-[#f9f6f3] px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute left-[-5%] top-[-50%] -z-10 h-[200px] w-[200px] rounded-full bg-[#f8cdb4]/30 blur-[80px]" />
      <div className="absolute bottom-[-50%] right-[-5%] -z-10 h-[200px] w-[200px] rounded-full bg-[#e3d1d1]/40 blur-[80px]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col">
          <h3 className="font-serif text-xl font-bold tracking-tight text-[#3c232c] sm:text-2xl">
            Janine Ayven Dequiros
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#3c232c]/70 sm:text-sm">
            <span className="font-medium">Virtual Assistant</span>
            <span className="hidden text-[#e3d1d1] sm:block">•</span>
            <div className="flex items-center gap-1 font-medium">
              <Icon icon="ph:map-pin-fill" className="text-sm text-[#ad6a6c]" />
              <span>
                {profileSettings.location || "Tarlac City, Philippines"}
              </span>
            </div>
          </div>
        </div>

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
              href={`mailto:${profileSettings.email_primary || "janedeqz@gmail.com"}`}
              icon={
                <Icon
                  icon="ph:envelope-simple-fill"
                  className="text-base text-[#ad6a6c]"
                />
              }
              label="Email"
            />
            <SocialButton
              href={profileSettings.facebook_url || "https://www.facebook.com"}
              icon={<Icon icon="logos:facebook" className="text-lg" />}
              label="Facebook"
            />
            <SocialButton
              href={
                profileSettings.instagram_url ||
                "https://www.instagram.com/deminineinks/"
              }
              icon={<Icon icon="skill-icons:instagram" className="text-lg" />}
              label="Instagram"
            />
            <SocialButton
              href={
                profileSettings.linkedin_url ||
                "https://www.linkedin.com/in/janine-ayven-de-quiros-82770a3a8/"
              }
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
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-xl border border-[#efdad0] bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[#ad6a6c] hover:bg-white"
    >
      {icon}
    </motion.a>
  );
}
