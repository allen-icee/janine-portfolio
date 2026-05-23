import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export function About() {
  const [imgErrors, setImgErrors] = useState({
    cutout: false,
    grad: false,
    college: false,
    shs: false,
  });

  const handleError = (key: keyof typeof imgErrors) => {
    setImgErrors((prev) => ({ ...prev, [key]: true }));
  };

  return (
    // Matches the alternating pattern perfectly
    <section
      id="about"
      className="relative overflow-hidden bg-[#f9f6f3] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#f8cdb4]/40 blur-[100px]" />
      <div className="absolute bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-[#e3d1d1]/40 blur-[120px]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-16 lg:gap-24">
        {/* SECTION 1: THE BIO */}
        <div className="flex flex-col items-center lg:flex-row lg:justify-center lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-0 w-full max-w-[280px] shrink-0 sm:max-w-xs lg:w-auto lg:max-w-none"
          >
            <div className="aspect-[3/4] w-full lg:h-[500px] lg:w-auto">
              {!imgErrors.cutout ? (
                <img
                  src="/src/assets/images/AboutPage.png"
                  alt="Janine Portrait"
                  className="h-full w-full object-contain drop-shadow-2xl"
                  onError={() => handleError("cutout")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[2rem] border-2 border-dashed border-[#ad6a6c]/30 bg-[#f8cdb4]/10 text-center lg:h-[500px] lg:w-[375px]">
                  <p className="font-serif text-sm font-bold text-[#ad6a6c]">
                    Transparent
                    <br />
                    Cutout Missing
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative z-10 w-full -mt-16 sm:max-w-xl lg:mt-0 lg:-ml-20 lg:w-1/2 lg:pb-10 lg:max-w-none"
          >
            <div className="rounded-[2rem] border border-[#efdad0] bg-white/80 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:p-10">
              <h2 className="font-serif text-4xl font-bold text-center tracking-tight text-[#3c232c] sm:text-5xl">
                About Me
              </h2>
              <p className="mt-3 font-serif text-lg font-bold italic text-[#ad6a6c]">
                Specializing in social media, design, research, and analytics.
              </p>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#3c232c]/80 sm:text-base">
                <p>
                  With experience in both corporate and freelance environments,
                  I bring structure, precision, and strategic thinking to every
                  project. I create high-quality visual assets, manage
                  brand-aligned digital platforms, and transform complex data
                  into actionable insights that drive informed decisions.
                </p>
                <p>
                  I operate with a high standard of professionalism,
                  confidentiality, and attention to detail. Whether supporting
                  entrepreneurs, global clients, or academic professionals, I
                  combine creative intelligence with analytical rigor to elevate
                  your business.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SECTION 2: EDUCATION */}
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 text-center lg:text-left">
            <div className="mb-3 flex items-center justify-center gap-3 lg:justify-start">
              <div className="grid size-12 place-items-center rounded-full bg-[#ad6a6c]/10 text-[#ad6a6c]">
                <Icon icon="ph:graduation-cap-duotone" className="text-2xl" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#3c232c] sm:text-4xl">
                Educational Background
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto w-full max-w-[320px] lg:mx-0 lg:max-w-none"
            >
              <div className="aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] border-[8px] border-white shadow-lg shadow-[#3c232c]/5">
                {!imgErrors.grad ? (
                  <img
                    src="/src/assets/images/GradPage.png"
                    alt="Graduation"
                    className="h-full w-full object-cover object-top"
                    onError={() => handleError("grad")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#e3d1d1]/30">
                    <p className="font-serif text-sm font-bold text-[#ad6a6c]">
                      3:4 Grad Photo
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="flex flex-col gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative pl-6 sm:pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:rounded-full before:bg-[#f8cdb4]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="size-12 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm p-1.5">
                    {!imgErrors.college ? (
                      <img
                        src="/src/assets/images/GJCLogo.png"
                        alt="College Logo"
                        className="h-full w-full object-contain"
                        onError={() => handleError("college")}
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 rounded-full" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#3c232c] sm:text-base">
                      Gerona Junior College Inc.
                    </h4>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#ad6a6c]">
                      Gerona, Tarlac City
                    </p>
                  </div>
                </div>
                <h5 className="mb-4 font-serif text-lg font-bold leading-tight text-[#3c232c] sm:text-xl">
                  Bachelor of Secondary Education Major in English
                </h5>
                <ul className="space-y-2 text-xs font-medium text-[#3c232c]/80 sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <Icon
                      icon="ph:medal-duotone"
                      className="shrink-0 text-lg text-[#ad6a6c]"
                    />{" "}
                    Graduated CUMLAUDE
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Icon
                      icon="ph:star-duotone"
                      className="shrink-0 text-lg text-[#ad6a6c]"
                    />{" "}
                    Highest GWA - 1.41
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Icon
                      icon="ph:trophy-duotone"
                      className="shrink-0 text-lg text-[#ad6a6c]"
                    />{" "}
                    Overall Best in Research Presentation, Manuscript, Defense &
                    Final Paper
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative pl-6 sm:pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:rounded-full before:bg-[#e3d1d1]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="size-12 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm p-1.5">
                    {!imgErrors.shs ? (
                      <img
                        src="/src/assets/images/SHSLogo.png"
                        alt="SHS Logo"
                        className="h-full w-full object-contain"
                        onError={() => handleError("shs")}
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 rounded-full" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#3c232c] sm:text-base">
                      Corazon C. Aquino High School
                    </h4>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#ad6a6c]">
                      Gerona, Tarlac City
                    </p>
                  </div>
                </div>
                <h5 className="mb-4 font-serif text-lg font-bold leading-tight text-[#3c232c] sm:text-xl">
                  Accountancy, Business and Management (ABM)
                </h5>
                <ul className="space-y-2 text-xs font-medium text-[#3c232c]/80 sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <Icon
                      icon="ph:medal-duotone"
                      className="shrink-0 text-lg text-[#ad6a6c]"
                    />{" "}
                    Senior High School Graduated WITH HONORS
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Icon
                      icon="ph:star-duotone"
                      className="shrink-0 text-lg text-[#ad6a6c]"
                    />{" "}
                    Highest Grade - 94
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Icon
                      icon="ph:trophy-duotone"
                      className="shrink-0 text-lg text-[#ad6a6c]"
                    />{" "}
                    Champion in Animation (Division Level)
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* SECTION 3: WORK EXPERIENCE */}
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
            <div className="grid size-12 place-items-center rounded-full bg-[#ad6a6c]/10 text-[#ad6a6c]">
              <Icon icon="ph:briefcase-duotone" className="text-2xl" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#3c232c] sm:text-4xl">
              Professional Journey
            </h2>
          </div>

          <div className="relative border-l-2 border-[#e3d1d1] pl-6 sm:pl-10 lg:ml-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative mb-12"
            >
              <span className="absolute -left-[35px] top-1 flex size-8 items-center justify-center bg-[#f9f6f3] sm:-left-[51px]">
                <Icon
                  icon="ph:circle-duotone"
                  className="text-xl text-[#ad6a6c]"
                />
              </span>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#3c232c]">
                    Infosys BPM
                  </h4>
                  <p className="mt-1 text-sm font-bold text-[#ad6a6c]">
                    Process Executive & Complaints Resolution Specialist
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/60 sm:text-right">
                  <span className="flex items-center gap-1.5 sm:justify-end">
                    <Icon icon="ph:map-pin-duotone" className="text-sm" /> SM
                    Clark, Pampanga
                  </span>
                  <span className="flex items-center gap-1.5 sm:justify-end">
                    <Icon icon="ph:calendar-duotone" className="text-sm" /> 1 yr
                    3 mos (Jan '25 - Feb '26)
                  </span>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[#efdad0] bg-white/60 p-5 shadow-sm backdrop-blur-sm sm:p-6">
                <ul className="list-inside list-disc space-y-2 text-sm text-[#3c232c]/85 marker:text-[#ad6a6c]">
                  <li>CS100 Top 1 Trainee & Mock Calls Top Trainee</li>
                  <li>Top Agent spanning January 2025 until February 2026</li>
                  <li>
                    Awarded Most Recognizable Agent for consistently doing the
                    extra mile
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <span className="absolute -left-[35px] top-1 flex size-8 items-center justify-center bg-[#f9f6f3] sm:-left-[51px]">
                <Icon
                  icon="ph:circle-duotone"
                  className="text-xl text-[#ad6a6c]"
                />
              </span>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#3c232c]">
                    Freelancer / Commissioner
                  </h4>
                  <p className="mt-1 text-sm font-bold text-[#ad6a6c]">
                    Academic Research Specialist
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/60 sm:text-right">
                  <span className="flex items-center gap-1.5 sm:justify-end">
                    <Icon icon="ph:map-pin-duotone" className="text-sm" /> WFH -
                    Tarlac City
                  </span>
                  <span className="flex items-center gap-1.5 sm:justify-end">
                    <Icon icon="ph:calendar-duotone" className="text-sm" /> 3
                    yrs 3 mos
                  </span>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[#efdad0] bg-white/60 p-5 shadow-sm backdrop-blur-sm sm:p-6">
                <ul className="list-inside list-disc space-y-2 text-sm text-[#3c232c]/85 marker:text-[#ad6a6c]">
                  <li>
                    Managed various tasks and projects for diverse clients
                    across different regions and grade levels.
                  </li>
                  <li>
                    Primary focus on comprehensive Researches and Thesis
                    documentation.
                  </li>
                  <li>
                    Delivered high-quality art-related commissions, including 2D
                    animations and custom illustrations.
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
