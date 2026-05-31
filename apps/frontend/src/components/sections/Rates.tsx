// apps/frontend/src/components/sections/Rates.tsx
import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { rateCategories as fallbackRateCategories } from "../../data/rates";
import type { RateCategory } from "../../types/content";
import { RatesTable } from "./rates/RatesTable";

type RatesProps = {
  rateCategories?: RateCategory[];
};

const INITIAL_LIMIT = 3;

export function Rates({ rateCategories = fallbackRateCategories }: RatesProps) {
  const [isInclusionsOpen, setIsInclusionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const visibleCategories = useMemo(
    () =>
      rateCategories
        .filter((category) => category.isActive !== false)
        .map((category) => ({
          ...category,
          groups: category.groups
            .filter((group) => group.isActive !== false)
            .map((group) => ({
              ...group,
              rates: group.rates.filter((rate) => rate.isActive !== false),
            }))
            .filter((group) => group.rates.length > 0)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        }))
        .filter((category) => category.groups.length > 0)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [rateCategories],
  );

  const [activeCategoryId, setActiveCategoryId] = useState(
    () => visibleCategories[0]?.id ?? visibleCategories[0]?.title ?? "",
  );

  const activeCategory =
    visibleCategories.find(
      (category) => (category.id ?? category.title) === activeCategoryId,
    ) ?? visibleCategories[0];

  const filteredGroups = useMemo(() => {
    if (!activeCategory) return [];

    const query = searchQuery.trim().toLowerCase();
    if (!query) return activeCategory.groups;

    return activeCategory.groups
      .map((group) => ({
        ...group,
        rates: group.rates.filter((rate) =>
          `${rate.name} ${rate.rate}`.toLowerCase().includes(query),
        ),
      }))
      .filter(
        (group) =>
          group.title.toLowerCase().includes(query) || group.rates.length > 0,
      );
  }, [activeCategory, searchQuery]);

  const displayedGroups = isExpanded
    ? filteredGroups
    : filteredGroups.slice(0, INITIAL_LIMIT);

  const hasMore = filteredGroups.length > INITIAL_LIMIT;

  const rateCount =
    activeCategory?.groups.reduce(
      (total, group) => total + group.rates.length,
      0,
    ) ?? 0;

  if (!activeCategory) return null;

  return (
    <section
      id="rates"
      className="relative overflow-hidden bg-[#f9f6f3] px-4 py-10 sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="absolute -left-24 top-16 -z-10 h-[360px] w-[360px] rounded-full bg-[#f8cdb4]/25 blur-[110px]" />
      <div className="absolute -right-24 bottom-16 -z-10 h-[360px] w-[360px] rounded-full bg-[#e3d1d1]/35 blur-[110px]" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-[#3c232c] sm:text-5xl">
              Rates
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#ad6a6c]">
              Starting prices for academic, creative, and support tasks.
            </p>
          </div>

          <div className="relative w-full shrink-0 md:w-72 lg:w-80">
            <Icon
              icon="ph:magnifying-glass-bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ad6a6c]"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsExpanded(false);
              }}
              placeholder="Search services..."
              className="h-11 w-full rounded-full border border-[#efdad0] bg-white/70 pl-10 pr-4 text-sm text-[#3c232c] outline-none transition focus:border-[#ad6a6c] focus:bg-white"
            />
          </div>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {visibleCategories.map((category) => {
            const key = category.id ?? category.title;
            const isActive =
              key === (activeCategory.id ?? activeCategory.title);

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveCategoryId(key);
                  setSearchQuery("");
                  setIsExpanded(false);
                }}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "border-[#ad6a6c] bg-[#ad6a6c] text-white shadow-sm"
                    : "border-[#efdad0] bg-white/65 text-[#3c232c]/70 hover:border-[#ad6a6c] hover:bg-white"
                }`}
              >
                <Icon
                  icon={category.iconName ?? "ph:sparkle-duotone"}
                  className="text-base"
                />
                {category.title}
              </button>
            );
          })}
        </div>

        <div className="mb-6 rounded-2xl border border-[#efdad0] bg-white/60 px-5 py-4 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <Icon
                  icon={
                    activeCategory.iconName ??
                    "ph:currency-circle-dollar-duotone"
                  }
                  className="text-2xl text-[#ad6a6c]"
                />
                <h3 className="font-serif text-xl font-bold text-[#3c232c] sm:text-2xl">
                  {activeCategory.title}
                </h3>
              </div>
              {(activeCategory.description || activeCategory.note) && (
                <p className="mt-1.5 max-w-4xl text-xs font-medium leading-5 text-[#3c232c]/65 sm:text-sm">
                  {activeCategory.description}
                  {activeCategory.description && activeCategory.note ? " " : ""}
                  {activeCategory.note}
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/55 md:justify-end">
              {Boolean(activeCategory.inclusions?.length) && (
                <button
                  type="button"
                  onClick={() => setIsInclusionsOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#ad6a6c] px-4 py-2 text-white shadow-sm transition hover:bg-[#3c232c] sm:w-auto"
                >
                  <Icon icon="ph:gift-duotone" className="text-sm" />
                  Package inclusions
                </button>
              )}
              <div className="flex w-full gap-2 sm:w-auto">
                <span className="flex w-full items-center justify-center rounded-full bg-[#f8cdb4]/30 px-3 py-2 sm:w-auto">
                  {activeCategory.groups.length} groups
                </span>
                <span className="flex w-full items-center justify-center rounded-full bg-[#e3d1d1]/35 px-3 py-2 sm:w-auto">
                  {rateCount} rates
                </span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory.id ?? activeCategory.title}-${searchQuery}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {filteredGroups.length > 0 ? (
              <>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {displayedGroups.map((group) => (
                    <RatesTable
                      key={group.id ?? `${activeCategory.title}-${group.title}`}
                      group={{
                        ...group,
                        rates: group.rates
                          .slice()
                          .sort((a, b) => a.sortOrder - b.sortOrder),
                      }}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#ad6a6c] bg-white/50 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#ad6a6c] shadow-sm backdrop-blur-md transition-all hover:bg-[#ad6a6c] hover:text-white sm:w-auto"
                    >
                      {isExpanded ? (
                        <>
                          Show Less{" "}
                          <Icon
                            icon="ph:caret-up-bold"
                            className="text-base transition-transform group-hover:-translate-y-0.5"
                          />
                        </>
                      ) : (
                        <>
                          Show More ({filteredGroups.length - INITIAL_LIMIT}){" "}
                          <Icon
                            icon="ph:caret-down-bold"
                            className="text-base transition-transform group-hover:translate-y-0.5"
                          />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-[#efdad0] bg-white/60 p-8 text-center shadow-sm backdrop-blur-md sm:p-12">
                <Icon
                  icon="ph:magnifying-glass-duotone"
                  className="mx-auto text-5xl text-[#ad6a6c]"
                />
                <h3 className="mt-4 font-serif text-2xl font-bold text-[#3c232c]">
                  No matching rates
                </h3>
                <p className="mt-2 text-sm text-[#3c232c]/65">
                  Try another search term or choose another category.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isInclusionsOpen && activeCategory.inclusions?.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end justify-center bg-[#3c232c]/50 px-0 backdrop-blur-md sm:items-center sm:px-4"
              onClick={() => setIsInclusionsOpen(false)}
            >
              <motion.article
                initial={{ y: "100%", scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: "100%", scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="max-h-[86svh] w-full max-w-2xl overflow-hidden rounded-t-[2rem] border border-[#efdad0] bg-[#f9f6f3] shadow-2xl sm:rounded-[2rem]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#efdad0] bg-white/70 px-5 py-4 backdrop-blur-md sm:px-6 sm:py-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                      {activeCategory.title}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold text-[#3c232c] sm:text-2xl">
                      Package Inclusions
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInclusionsOpen(false)}
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-[#efdad0] bg-white text-[#3c232c] transition hover:bg-[#e3d1d1] hover:text-[#ad6a6c]"
                  >
                    <Icon icon="ph:x-bold" className="text-base" />
                  </button>
                </div>

                <div className="max-h-[68svh] overflow-y-auto p-5 sm:p-6">
                  <p className="mb-5 rounded-2xl border border-[#efdad0] bg-white/60 px-4 py-3.5 text-sm font-medium leading-6 text-[#3c232c]/75">
                    When you avail of a full package from this category, these
                    are part of the support you receive.
                  </p>

                  <ol className="grid gap-3">
                    {activeCategory.inclusions.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="grid grid-cols-[2.25rem_1fr] gap-3 rounded-2xl border border-[#efdad0]/80 bg-white/65 px-4 py-3.5 text-sm leading-6 text-[#3c232c]/80 shadow-sm"
                      >
                        <span className="grid size-9 place-items-center rounded-full bg-[#f8cdb4]/35 text-xs font-extrabold text-[#ad6a6c]">
                          {index + 1}
                        </span>
                        <span className="pt-1.5">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.article>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
