// apps\frontend\src\components\sections\Services.tsx
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { services as fallbackServices } from "../../data/site";
import type { PublicService } from "../../types/content";

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

function SafeToolIcon({
  icon,
  label,
  fallbackImage,
}: {
  icon?: string;
  label: string;
  fallbackImage?: string;
}) {
  const isCustomFallback = icon?.startsWith("custom-") || !icon;

  return (
    <span
      className="grid size-12 place-items-center rounded-2xl border border-[#efdad0] bg-[#f8cdb4]/20 text-2xl text-[#ad6a6c] shadow-sm transition hover:-translate-y-1 hover:bg-white"
      title={label}
    >
      {isCustomFallback ? (
        fallbackImage ? (
          <img
            src={fallbackImage}
            alt={label}
            className="h-7 w-7 object-contain"
          />
        ) : (
          <span className="text-xs font-bold text-[#ad6a6c]">
            {label.slice(0, 2).toUpperCase()}
          </span>
        )
      ) : (
        <Icon icon={icon} />
      )}
    </span>
  );
}

type ServicesProps = {
  services?: PublicService[];
};

export function Services({ services = fallbackServices }: ServicesProps) {
  const [activeService, setActiveService] = useState(0);

  const editableServices = services as PublicService[];

  if (!editableServices.length) return null;

  const activeServiceItem =
    editableServices[activeService % editableServices.length];

  const handleNext = () =>
    setActiveService((prev) => (prev + 1) % editableServices.length);

  const handlePrev = () =>
    setActiveService(
      (prev) => (prev - 1 + editableServices.length) % editableServices.length,
    );

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#efe9e5] px-4 py-10 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="absolute left-0 top-10 -z-10 h-[500px] w-[500px] rounded-full bg-[#f8cdb4]/30 blur-[120px]" />

      <div className="absolute bottom-10 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-[#e3d1d1]/40 blur-[150px]" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-serif text-5xl font-bold tracking-tight text-[#3c232c] lg:text-6xl">
              My Services
            </h2>

            <p className="mt-3 font-serif text-lg font-bold italic tracking-wide text-[#ad6a6c]">
              Expertise I am experienced.
            </p>
          </div>

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

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.75fr_1.25fr] lg:gap-10">
          <div className="hidden lg:flex lg:flex-col lg:gap-4">
            {editableServices.map((service, index) => (
              <button
                key={service.title}
                type="button"
                onClick={() => setActiveService(index)}
                className={`group w-full rounded-3xl border p-6 text-left transition-all duration-300 ${
                  activeService === index
                    ? "scale-[1.02] border-[#ad6a6c] bg-white shadow-xl"
                    : "border-[#efdad0] bg-white/50 hover:bg-white/80"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon
                    icon={service.iconName ?? "ph:star-duotone"}
                    className={`text-3xl transition-colors ${
                      activeService === index
                        ? "text-[#ad6a6c]"
                        : "text-[#ad6a6c]/70"
                    }`}
                  />

                  <h3 className="font-serif text-xl font-bold text-[#3c232c]">
                    {service.title}
                  </h3>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#3c232c]/80">
                  {service.description}
                </p>
              </button>
            ))}
          </div>

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
                  <div className="flex flex-col">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-[2rem] border-[6px] border-white shadow-sm">
                      <SafeImage
                        src={activeServiceItem.imageUrl}
                        alt={activeServiceItem.title}
                      />
                    </div>

                    <div className="mt-6">
                      <h3 className="font-serif text-xl font-bold text-[#3c232c]">
                        Professional Background:
                      </h3>

                      <p className="mt-4 text-sm leading-relaxed text-[#3c232c]/85 sm:text-base">
                        {activeServiceItem.professionalBackground ??
                          activeServiceItem.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h4 className="font-serif text-xl font-bold text-[#3c232c]">
                      {activeServiceItem.toolTitle ?? "Tools & Software"}
                    </h4>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {(activeServiceItem.tools ?? []).map((tool, index) => (
                        <SafeToolIcon
                          key={`${tool}-${index}`}
                          icon={tool}
                          label={tool}
                          fallbackImage={
                            activeServiceItem.toolFallbacks?.[tool]
                          }
                        />
                      ))}
                    </div>

                    <h4 className="mt-8 font-serif text-xl font-bold text-[#3c232c]">
                      Expertise / Skills
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

                    <div className="mt-auto flex justify-end pt-10">
                      <a
                        href="#portfolio"
                        className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#ad6a6c] to-[#8d4f5f] px-8 py-4 text-sm font-bold tracking-[0.15em] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                      >
                        View Sample Projects
                        <Icon icon="ph:arrow-right-bold" className="text-lg" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-6 lg:hidden">
              <button
                type="button"
                onClick={handlePrev}
                className="grid size-12 place-items-center rounded-full border border-[#efdad0] bg-white/60 text-[#3c232c] shadow-sm transition hover:border-[#ad6a6c] hover:bg-white hover:text-[#ad6a6c]"
              >
                <Icon icon="ph:caret-left-bold" className="text-xl" />
              </button>

              <div className="rounded-full border border-[#efdad0] bg-white/40 px-4 py-2 font-serif text-sm font-bold tracking-widest text-[#3c232c]/70 backdrop-blur-xs">
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
