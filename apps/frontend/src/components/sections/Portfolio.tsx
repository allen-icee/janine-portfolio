import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Icon } from "@iconify/react";
import { categories, portfolioItems } from "../../data/site";
import type { PortfolioItem } from "../../types/content";

function imageOrPlaceholder(url: string | undefined, label: string) {
  if (url) {
    return (
      <img
        src={url}
        alt={label}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
      />
    );
  }

  return (
    <div className="grid h-full min-h-[200px] place-items-center bg-gradient-to-br from-[#f8cdb4]/40 to-[#e3d1d1]/40">
      <div className="rounded-2xl border border-[#efdad0] bg-white/50 px-6 py-4 text-center backdrop-blur-sm">
        <p className="font-serif text-2xl text-[#ad6a6c]">JD</p>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#3c232c]/70">
          {label}
        </p>
      </div>
    </div>
  );
}

export function Portfolio() {
  const [category, setCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(
    null,
  );

  const INITIAL_COUNT = 4;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filteredProjects = useMemo(() => {
    return category === "All"
      ? portfolioItems
      : portfolioItems.filter((project) => project.category === category);
  }, [category]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;
  const canCollapse =
    visibleCount > INITIAL_COUNT && visibleProjects.length > 0;

  const handleTabClick = (tab: string) => {
    if (category === tab) return;
    setCategory(tab);
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <>
      <section
        id="portfolio"
        className="relative overflow-hidden bg-[#f9f6f3] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        {/* Soft Warm Glows to break up the "gray" feeling */}
        <div className="absolute -left-20 top-20 -z-10 h-[400px] w-[400px] rounded-full bg-[#f8cdb4]/20 blur-[100px]" />
        <div className="absolute -right-20 bottom-20 -z-10 h-[400px] w-[400px] rounded-full bg-[#e3d1d1]/30 blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          {/* Flipped Typography Hierarchy */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-serif text-4xl font-bold tracking-tight text-[#3c232c] sm:text-5xl lg:text-6xl">
              Portfolio
            </h2>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#ad6a6c]">
              Selected works and outcomes.
            </p>
          </div>

          {/* Scrollbar-Hidden Tabs */}
          <div className="mb-10 w-full border-b border-[#e3d1d1]/60">
            <div className="flex gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((item) => {
                const isActive = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleTabClick(item)}
                    className={`relative whitespace-nowrap pb-4 text-sm font-bold tracking-wide transition-colors duration-300 ${
                      isActive
                        ? "text-[#3c232c]"
                        : "text-[#3c232c]/50 hover:text-[#ad6a6c]"
                    }`}
                  >
                    {item}
                    {isActive && (
                      <motion.div
                        layoutId="activePortfolioTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[#ad6a6c]"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid or Empty State */}
          <AnimatePresence mode="wait">
            {visibleProjects.length > 0 ? (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
              >
                {visibleProjects.map((project) => (
                  <button
                    key={project.id || project.title}
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="group flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-[#efdad0] bg-white/60 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-[#3c232c]/5"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden border-b border-[#efdad0]/50">
                      {imageOrPlaceholder(project.coverUrl, project.title)}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                        {project.category}
                      </p>
                      <h3 className="mt-1.5 font-serif text-lg font-bold leading-tight text-[#3c232c] transition-colors group-hover:text-[#ad6a6c] sm:text-xl">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#3c232c]/75 line-clamp-2">
                        {project.summary}
                      </p>

                      <div className="mt-auto pt-4">
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 3).map((tool) => (
                            <span
                              key={tool}
                              className="rounded-md bg-[#f8cdb4]/30 px-2 py-1 text-[10px] font-semibold text-[#3c232c]"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            ) : (
              /* Beautiful Empty State */
              <motion.div
                key={`empty-${category}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center rounded-[2rem] border border-[#efdad0]/50 bg-white/40 py-20 text-center backdrop-blur-sm"
              >
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#f8cdb4]/30 text-[#ad6a6c]">
                  <Icon icon="ph:folder-open-duotone" className="text-3xl" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#3c232c]">
                  No projects available yet
                </h3>
                <p className="mt-2 max-w-sm text-sm text-[#3c232c]/70">
                  Sample works for{" "}
                  <span className="font-semibold text-[#ad6a6c]">
                    {category}
                  </span>{" "}
                  will be updated soon. Check out the other categories in the
                  meantime!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand / Collapse Actions */}
          {visibleProjects.length > 0 && (
            <div className="mt-12 flex justify-center gap-4">
              {hasMore && (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="flex items-center gap-2 rounded-full bg-[#ad6a6c] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#3c232c] hover:shadow-md"
                >
                  Load More
                  <ChevronDown size={16} />
                </button>
              )}

              {canCollapse && (
                <button
                  onClick={() => setVisibleCount(INITIAL_COUNT)}
                  className="flex items-center gap-2 rounded-full border-2 border-[#e3d1d1] bg-white/50 px-6 py-3 text-sm font-bold text-[#3c232c] transition-all hover:border-[#ad6a6c] hover:bg-white"
                >
                  Show Less
                  <ChevronUp size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Embedded Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Modal Component
function ProjectModal({
  project,
  onClose,
}: {
  project: PortfolioItem;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#3c232c]/50 px-0 backdrop-blur-md sm:items-center sm:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.article
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex max-h-[90svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[2rem] border border-[#efdad0] bg-[#f9f6f3] shadow-2xl sm:rounded-[2.5rem]"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#efdad0]/50 bg-[#f9f6f3]/95 px-5 py-5 backdrop-blur-md sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
              {project.category}
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold leading-tight text-[#3c232c] sm:text-3xl">
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-[#efdad0] bg-white text-[#3c232c] transition-colors hover:bg-[#e3d1d1] hover:text-[#ad6a6c]"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-5 py-6 sm:px-8 sm:py-8">
          <div className="aspect-video w-full overflow-hidden rounded-2xl border-[4px] border-white shadow-sm">
            {imageOrPlaceholder(project.coverUrl, project.title)}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-[#3c232c]/85 sm:text-base">
            {project.description}
          </p>

          {project.outcome && (
            <div className="mt-8 rounded-2xl border border-[#efdad0] bg-white p-5 shadow-sm sm:p-6">
              <p className="font-serif text-lg font-bold text-[#ad6a6c]">
                Client Outcome
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#3c232c]/85 sm:text-base">
                {project.outcome}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-2">
            {project.technologies.map((tool) => (
              <span
                key={tool}
                className="rounded-lg bg-[#f8cdb4]/40 px-3 py-1.5 text-xs font-semibold text-[#3c232c]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
