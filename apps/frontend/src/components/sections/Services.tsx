import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "../../data/site";
import type { PublicService } from "../../types/content";

// Safe, crash-proof image component
function SafeImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`grid h-full min-h-[200px] place-items-center bg-gradient-to-br from-[#f8cdb4]/40 to-[#e3d1d1]/40 ${className}`}
      >
        <div className="rounded-[1.5rem] border border-[#efdad0] bg-white/50 px-8 py-6 text-center backdrop-blur-md">
          <p className="font-serif text-4xl font-bold text-[#ad6a6c]">JD</p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/70">
            {alt}
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-cover transition-transform duration-[1.5s] hover:scale-105 ${className}`}
      onError={() => setError(true)}
    />
  );
}

export function Services() {
  const [activeService, setActiveService] = useState(0);

  const editableServices = services as PublicService[];
  const activeServiceItem =
    editableServices[activeService % editableServices.length];

  if (!editableServices.length) return null;

  const handleNext = () =>
    setActiveService((prev) => (prev + 1) % editableServices.length);
  const handlePrev = () =>
    setActiveService(
      (prev) => (prev - 1 + editableServices.length) % editableServices.length,
    );

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#f9f6f3] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      {/* Background Ambience */}
      <div className="absolute left-0 top-10 -z-10 h-[500px] w-[500px] rounded-full bg-[#f8cdb4]/30 blur-[120px]" />
      <div className="absolute bottom-10 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-[#e3d1d1]/40 blur-[150px]" />

      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* FIXED TYPOGRAPHY: Services is large, Expertise is small */}
            <h2 className="font-serif text-5xl font-bold tracking-tight text-[#3c232c] lg:text-6xl">
              Services.
            </h2>
            <p className="mt-3 font-serif text-lg font-bold italic tracking-wide text-[#ad6a6c]">
              Expertise that feels organized.
            </p>
          </div>

          {/* Desktop Top Navigation Arrows */}
          <div className="hidden gap-3 lg:flex">
            <button
              type="button"
              onClick={handlePrev}
              className="grid size-12 place-items-center rounded-full border border-[#efdad0] bg-white/60 text-[#3c232c] transition hover:border-[#ad6a6c] hover:bg-white hover:text-[#ad6a6c]"
            >
              <Icon icon="ph:caret-left-bold" className="text-lg" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="grid size-12 place-items-center rounded-full border border-[#efdad0] bg-white/60 text-[#3c232c] transition hover:border-[#ad6a6c] hover:bg-white hover:text-[#ad6a6c]"
            >
              <Icon icon="ph:caret-right-bold" className="text-lg" />
            </button>
          </div>
        </div>

        {/* Compact Split Layout */}
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.75fr_1.25fr] lg:gap-10">
          {/* =========================================================
              LEFT: Service Selector (Hidden on Mobile to prevent clipping)
          ========================================================= */}
          <div className="hidden lg:flex lg:flex-col lg:gap-4">
            {editableServices.map((service, index) => (
              <button
                key={service.title}
                type="button"
                onClick={() => setActiveService(index)}
                className={`group w-full rounded-3xl border p-6 text-left transition-all duration-300 ${
                  activeService === index
                    ? "border-[#ad6a6c] bg-white shadow-xl scale-[1.02]"
                    : "border-[#efdad0] bg-white/50 hover:bg-white/80"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon
                    icon={service.iconName ?? "ph:star-duotone"}
                    className={`text-3xl transition-colors ${activeService === index ? "text-[#ad6a6c]" : "text-[#ad6a6c]/70"}`}
                  />
                  <h3 className="font-serif text-xl font-bold text-[#3c232c]">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#3c232c]/80 line-clamp-2">
                  {service.description}
                </p>
              </button>
            ))}
          </div>

          {/* =========================================================
              RIGHT: Active Service Details Panel
          ========================================================= */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeServiceItem.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="rounded-[2.5rem] border border-[#efdad0] bg-white/70 p-6 shadow-lg backdrop-blur-md sm:p-8 lg:p-10"
              >
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
                  {/* Panel Left: Image & Background */}
                  <div className="flex flex-col">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-[2rem] border-[6px] border-white shadow-sm">
                      <SafeImage
                        src={activeServiceItem.imageUrl}
                        alt={activeServiceItem.title}
                      />
                    </div>
                    <h3 className="mt-6 font-serif text-3xl font-bold text-[#3c232c] sm:text-4xl">
                      {activeServiceItem.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-[#3c232c]/85 sm:text-base">
                      {activeServiceItem.professionalBackground ??
                        activeServiceItem.description}
                    </p>
                  </div>

                  {/* Panel Right: Tools, Expertise & CTA */}
                  <div className="flex flex-col">
                    <h4 className="font-serif text-2xl font-bold text-[#3c232c]">
                      Tools & Software
                    </h4>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {(activeServiceItem.tools ?? []).map((tool) => (
                        <span
                          key={tool}
                          className="grid size-12 place-items-center rounded-2xl border border-[#efdad0] bg-[#f8cdb4]/20 text-2xl text-[#ad6a6c] shadow-sm transition hover:-translate-y-1 hover:bg-white"
                          title={tool}
                        >
                          <Icon icon={tool} />
                        </span>
                      ))}
                    </div>

                    <h4 className="mt-8 font-serif text-2xl font-bold text-[#3c232c]">
                      Core Expertise
                    </h4>
                    <ul className="mt-5 space-y-3 text-sm text-[#3c232c]/85 sm:text-base">
                      {(
                        activeServiceItem.expertise ?? [
                          activeServiceItem.description,
                        ]
                      ).map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 leading-relaxed"
                        >
                          <Icon
                            icon="ph:check-circle-duotone"
                            className="mt-1 shrink-0 text-lg text-[#ad6a6c]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* Button anchored to bottom */}
                    <div className="mt-auto pt-10">
                      <a
                        href="#portfolio"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ad6a6c] px-6 py-4 text-sm font-bold tracking-wide text-white transition-all hover:-translate-y-1 hover:bg-[#3c232c] hover:shadow-lg hover:shadow-[#3c232c]/20 sm:w-auto"
                      >
                        View Sample Projects
                        <Icon icon="ph:arrow-right-bold" className="text-lg" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>

            {/* =========================================================
                MOBILE NAVIGATION: Underneath the card (Hidden on Desktop)
            ========================================================= */}
            <div className="mt-8 flex items-center justify-center gap-6 lg:hidden">
              <button
                type="button"
                onClick={handlePrev}
                className="grid size-12 place-items-center rounded-full border border-[#efdad0] bg-white/60 text-[#3c232c] shadow-sm transition hover:border-[#ad6a6c] hover:bg-white hover:text-[#ad6a6c]"
              >
                <Icon icon="ph:caret-left-bold" className="text-xl" />
              </button>

              {/* Slide Index Counter */}
              <div className="font-serif text-sm font-bold tracking-widest text-[#3c232c]/70 bg-white/40 border border-[#efdad0] px-4 py-2 rounded-full backdrop-blur-xs">
                <span className="text-[#ad6a6c]">
                  {String(activeService + 1).padStart(2, "0")}
                </span>
                <span className="mx-2 text-[#e3d1d1]">/</span>
                <span>{String(editableServices.length).padStart(2, "0")}</span>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="grid size-12 place-items-center rounded-full border border-[#efdad0] bg-white/60 text-[#3c232c] shadow-sm transition hover:border-[#ad6a6c] hover:bg-white hover:text-[#ad6a6c]"
              >
                <Icon icon="ph:caret-right-bold" className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
