import { ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Player } from "@lottiefiles/react-lottie-player";

import typingAnimation from "../../assets/lottie/typing-animation.json";
import { profile } from "../../data/site";

const creativeSkills = [
  { name: "Social Media Management", icon: "ph:device-mobile-camera-duotone" },
  { name: "Graphic Design & Illustration", icon: "ph:bezier-curve-duotone" },
  { name: "Virtual Research Consultant", icon: "ph:magnifying-glass-duotone" },
  { name: "Data & Analytics", icon: "ph:chart-polar-duotone" },
  { name: "Academic Research Support", icon: "ph:books-duotone" },
  { name: "Documentation", icon: "ph:files-duotone" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f9f6f3] px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
      {/* Background Glow */}
      <div className="absolute -left-[10%] top-10 -z-10 h-[500px] w-[500px] rounded-full bg-[#f8cdb4]/40 blur-[120px]" />
      <div className="absolute -right-[5%] bottom-0 -z-10 h-[600px] w-[600px] rounded-full bg-[#e3d1d1]/50 blur-[150px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          {/* Subtitle */}
          <p className="mb-3 font-serif text-[10px] font-bold uppercase tracking-[0.14em] text-[#ad6a6c] sm:mb-4 sm:text-sm sm:tracking-[0.2em]">
            <span className="bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] bg-clip-text text-transparent">
              {profile.name || "Janine Ayven Dequiros"}
            </span>

            <span className="mx-2 font-light text-[#e3d1d1]">|</span>

            {profile.title}
          </p>

          {/* Heading */}
          <h1 className="max-w-3xl font-serif text-3xl font-bold leading-[1.05] tracking-tight text-[#3c232c] sm:text-4xl lg:text-6xl">
            Plan and grow,
            <br />
            face the unknown.
          </h1>

          {/* Quote */}
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-[#3c232c]/75 sm:mt-5 sm:text-base">
            {profile.tagline}
          </p>

          {/* Buttons */}
          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:gap-4">
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:-translate-y-1 hover:opacity-90 sm:w-auto"
            >
              Get in Touch
              <ArrowRight size={18} />
            </a>

            <a
              href="#services"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#e3d1d1] bg-white/50 px-7 py-3.5 text-sm font-bold tracking-wide text-[#3c232c] transition-all duration-300 hover:border-[#ad6a6c] hover:bg-white sm:w-auto"
            >
              View Services
            </a>

            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium tracking-wide text-[#3c232c]/80 transition-all duration-300 hover:text-[#ad6a6c]"
              >
                <Download size={18} />
                Download CV
              </a>
            )}
          </div>

          {/* Skills */}
          <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start lg:mt-8">
            {creativeSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/40 px-2.5 py-1 backdrop-blur-md"
              >
                <Icon icon={skill.icon} className="text-base text-[#ad6a6c]" />

                <span className="text-[11px] font-medium text-[#3c232c]/75">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto w-full max-w-[340px] sm:max-w-md lg:ml-auto"
        >
          {/* Frame */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[14rem] rounded-b-[2.5rem] border-[8px] border-white/80 bg-[#f8cdb4]/20 shadow-[0_20px_50px_rgba(60,35,44,0.08)]">
            <img
              src="/src/assets/images/HeroPage.png"
              alt="Janine Ayven Dequiros"
              className="h-full w-full object-cover"
            />

            {/* Status Indicator */}
            <div className="absolute bottom-5 left-5 flex items-center justify-center">
              <span className="absolute h-6 w-6 animate-ping rounded-full bg-green-400 opacity-60"></span>

              <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
                <Icon
                  icon="mdi:check-circle"
                  className="text-[20px] text-green-500"
                />
              </div>
            </div>

            {/* LOTTIE */}
            <div className="absolute -bottom-6 right-0 sm:-bottom-15 sm:-right-15">
              <Player
                autoplay
                loop
                src={typingAnimation}
                className="h-[180px] w-[180px] sm:h-[300px] sm:w-[300px]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
