import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { proofItems } from "../../data/site";
import type { ProofItem } from "../../types/content";

// Crash-proof image handler with your exact palette
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
        className={`grid h-full min-h-[200px] place-items-center bg-gradient-to-br from-[#f8cdb4]/30 to-[#e3d1d1]/30 ${className}`}
      >
        <div className="rounded-[1.5rem] border border-[#efdad0] bg-white/50 px-6 py-4 text-center backdrop-blur-md">
          <p className="font-serif text-3xl font-bold text-[#ad6a6c]">JD</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/70">
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
      className={`h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105 ${className}`}
      onError={() => setError(true)}
    />
  );
}

export function Proofs({ proofs = proofItems }: { proofs?: ProofItem[] }) {
  // Pagination State
  const INITIAL_COUNT = 8;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // Modal State for reading screenshots
  const [selectedProof, setSelectedProof] = useState<ProofItem | null>(null);

  if (!proofs?.length) return null;

  const visibleProofs = proofs.slice(0, visibleCount);
  const hasMore = visibleCount < proofs.length;
  const canCollapse = visibleCount > INITIAL_COUNT;

  return (
    <>
      <section
        id="proofs"
        className="relative overflow-hidden bg-[#f0eeea] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        {/* Subtle Background Ambience */}
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#f8cdb4]/20 blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          {/* Header Section based on your reference image */}
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="mb-4 flex justify-center">
              <div className="grid size-12 place-items-center rounded-full bg-[#ad6a6c]/10 text-[#ad6a6c]">
                <Icon icon="ph:star-duotone" className="text-2xl" />
              </div>
            </div>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-[#3c232c] sm:text-5xl lg:text-6xl">
              Catered over 1,000+ clients.
            </h2>
            <p className="mt-4 font-serif text-lg font-bold italic tracking-wide text-[#ad6a6c] sm:text-xl">
              New clients are welcome. Let me know if you still need more proof!
            </p>
          </div>

          {/* Scalable, Perfectly Aligned Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {visibleProofs.map((proof) => (
                <motion.button
                  key={proof.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  type="button"
                  onClick={() => setSelectedProof(proof)}
                  className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-[#efdad0] bg-white/60 text-left shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-[#3c232c]/5"
                >
                  {/* Fixed Aspect Ratio forces perfect alignment */}
                  <div className="aspect-[4/3] w-full overflow-hidden border-b border-[#efdad0]/50 bg-white">
                    <SafeImage src={proof.imageUrl} alt={proof.title} />

                    {/* Hover Overlay to indicate it can be clicked/expanded */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#3c232c]/0 opacity-0 transition-all duration-300 group-hover:bg-[#3c232c]/20 group-hover:opacity-100">
                      <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#3c232c] shadow-sm backdrop-blur-md">
                        <Icon
                          icon="ph:arrows-out-duotone"
                          className="text-lg text-[#ad6a6c]"
                        />{" "}
                        Expand
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                      {proof.category}
                    </p>
                    <h3 className="mt-1 font-serif text-lg font-bold leading-tight text-[#3c232c]">
                      {proof.title}
                    </h3>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination Controls */}
          <div className="mt-12 flex justify-center gap-4">
            {hasMore && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="flex items-center gap-2 rounded-full bg-[#ad6a6c] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#3c232c] hover:shadow-md"
              >
                Load More Proof
                <Icon icon="ph:caret-down-bold" className="text-lg" />
              </button>
            )}

            {canCollapse && (
              <button
                onClick={() => setVisibleCount(INITIAL_COUNT)}
                className="flex items-center gap-2 rounded-full border border-[#efdad0] bg-white/60 px-6 py-3.5 text-sm font-bold text-[#3c232c] transition-all hover:border-[#ad6a6c] hover:bg-white"
              >
                Show Less
                <Icon icon="ph:caret-up-bold" className="text-lg" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          THE LIGHTBOX MODAL (For reading full, uncropped screenshots)
      ========================================================= */}
      <AnimatePresence>
        {selectedProof && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3c232c]/80 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setSelectedProof(null)} // Close when clicking outside
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
              className="relative flex max-h-[90svh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-[#f9f6f3] shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#efdad0] bg-white/50 px-6 py-4 backdrop-blur-md">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                    {selectedProof.category}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-[#3c232c]">
                    {selectedProof.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProof(null)}
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-[#efdad0] bg-white text-[#3c232c] transition-colors hover:bg-[#e3d1d1] hover:text-[#ad6a6c]"
                >
                  <Icon icon="ph:x-bold" className="text-lg" />
                </button>
              </div>

              {/* Modal Image (object-contain ensures NO CROPPING) */}
              <div className="flex-1 overflow-auto bg-[#e3d1d1]/20 p-4 sm:p-8">
                <img
                  src={selectedProof.imageUrl}
                  alt={selectedProof.title}
                  className="mx-auto max-h-[70svh] w-auto rounded-xl object-contain drop-shadow-xl"
                />

                {selectedProof.description && (
                  <p className="mx-auto mt-6 max-w-2xl text-center text-sm font-medium leading-relaxed text-[#3c232c]/80">
                    {selectedProof.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
