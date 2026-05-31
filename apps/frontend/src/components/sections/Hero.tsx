// apps\frontend\src\components\sections\Hero.tsx
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Player } from "@lottiefiles/react-lottie-player";

import typingAnimation from "../../assets/lottie/typing-animation.json";
import heroImage from "../../assets/images/HeroPage.png";
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#e3d1d1]/50 via-[#f9f6f3] to-[#efe9e5] px-4 pb-10 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
      {" "}
      <div className="absolute -left-[5%] top-0 -z-10 h-[600px] w-[600px] rounded-full bg-[#f8cdb4]/50 blur-[130px]" />
      <div className="absolute -right-[5%] bottom-10 -z-10 h-[700px] w-[700px] rounded-full bg-[#e3d1d1]/60 blur-[160px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <p className="mb-4 font-serif text-[10px] font-bold uppercase tracking-[0.15em] text-[#ad6a6c] sm:mb-5 sm:text-xs sm:tracking-[0.2em]">
            <span className="bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] bg-clip-text text-transparent">
              Janine Ayven Dequiros
            </span>
            <span className="mx-3 font-light text-[#ad6a6c]/30">|</span>
            {profile.title}
          </p>

          <h1 className="max-w-3xl font-serif text-4xl font-bold leading-[1.08] tracking-tight text-[#3c232c] sm:text-5xl lg:text-[4.5rem]">
            Plan and grow,
            <br />
            face the unknown.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#3c232c]/80 sm:mt-6 sm:text-base">
            {profile.tagline}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4">
            <a
              href="#contact"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] px-8 py-4 text-sm font-bold tracking-wide text-white shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg sm:w-auto"
            >
              Get in Touch
              <Icon
                icon="ph:arrow-right-bold"
                className="text-lg transition-transform group-hover:translate-x-1"
              />
            </a>

            <a
              href="#services"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#e3d1d1] bg-white/50 px-8 py-4 text-sm font-bold tracking-wide text-[#3c232c] transition-all duration-300 hover:border-[#ad6a6c] hover:bg-white sm:w-auto"
            >
              View Services
            </a>

            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold tracking-wide text-[#3c232c]/80 transition-all duration-300 hover:text-[#ad6a6c]"
              >
                <Icon
                  icon="ph:download-simple-bold"
                  className="text-lg transition-transform group-hover:-translate-y-1"
                />
                Download CV
              </a>
            )}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2.5 lg:justify-start lg:mt-12">
            {creativeSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex items-center gap-2 rounded-xl border border-[#efdad0]/60 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-md transition-colors hover:border-[#ad6a6c]/40 hover:bg-white"
              >
                <Icon icon={skill.icon} className="text-lg text-[#ad6a6c]" />
                <span className="text-xs font-bold tracking-wide text-[#3c232c]/85">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto w-full max-w-[340px] sm:max-w-md lg:ml-auto"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[14rem] rounded-b-[3rem] border-[8px] border-white/90 bg-[#f8cdb4]/20 shadow-2xl shadow-[#3c232c]/10">
            <img
              src={heroImage}
              alt="Janine Ayven Dequiros"
              className="h-full w-full object-cover"
            />

            <div
              className="absolute bottom-6 left-6 flex items-center justify-center"
              title="Available for work"
            >
              <span className="absolute h-6 w-6 animate-ping rounded-full bg-[#ad6a6c] opacity-60"></span>
              <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
                <Icon
                  icon="ph:check-circle-fill"
                  className="text-[20px] text-[#ad6a6c]"
                />
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-6 right-0 sm:-bottom-12 sm:-right-12">
              <Player
                autoplay
                loop
                src={typingAnimation}
                className="h-[180px] w-[180px] drop-shadow-xl sm:h-[280px] sm:w-[280px]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
