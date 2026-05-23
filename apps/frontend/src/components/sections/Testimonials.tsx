import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "../../data/site";
import type { Testimonial } from "../../types/content";

export function Testimonials() {
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // States for the Interactive Star Rating in the form
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Automatically generates initials from the name (e.g., "John Doe" -> "JD")
  const getInitials = (name: string) => {
    if (!name) return "JD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <section
        id="testimonials"
        className="relative overflow-hidden bg-[#f9f6f3] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        {/* Background Ambience Elements */}
        <div className="absolute -left-[10%] top-0 -z-10 h-[400px] w-[400px] rounded-full bg-[#f8cdb4]/30 blur-[100px]" />
        <div className="absolute -right-[5%] bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-[#e3d1d1]/40 blur-[100px]" />

        <div className="mx-auto max-w-7xl">
          {/* Header & Actions */}
          <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-serif text-4xl font-bold tracking-tight text-[#3c232c] sm:text-5xl lg:text-6xl">
                Client Feedback
              </h2>
              <p className="mt-2 font-serif text-lg font-bold italic tracking-wide text-[#ad6a6c] sm:text-xl">
                Don't forget to leave a review.
              </p>
            </div>

            {/* Submit Review CTA */}
            <button
              type="button"
              onClick={() => {
                setRating(5); // reset rating when opening
                setIsReviewModalOpen(true);
              }}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-[#e3d1d1] bg-white/50 px-6 py-3.5 text-sm font-bold text-[#3c232c] transition-all hover:border-[#ad6a6c] hover:bg-white"
            >
              <Icon
                icon="ph:pencil-simple-line-duotone"
                className="text-lg text-[#ad6a6c] transition-transform group-hover:scale-110"
              />
              Submit a Review
            </button>
          </div>

          {/* Carousel Track & Controls Container */}
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6"
            >
              {testimonials.map((item, index) => (
                <motion.button
                  key={item.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  type="button"
                  onClick={() => setSelectedTestimonial(item)}
                  className="group relative flex w-[85vw] max-w-[380px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[2rem] border border-[#efdad0] bg-white/60 p-6 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-xl hover:shadow-[#3c232c]/5 sm:p-8"
                >
                  <Icon
                    icon="ph:quotes-duotone"
                    className="absolute right-5 top-5 text-5xl text-[#f8cdb4]/40 transition-transform duration-500 group-hover:scale-110 group-hover:text-[#f8cdb4]/60"
                  />

                  <div>
                    <div className="mb-5 flex gap-1 text-[#ad6a6c]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          icon={i < item.rating ? "ph:star-fill" : "ph:star"}
                          className="text-base sm:text-lg"
                        />
                      ))}
                    </div>

                    {/* FIXED: Now using item.feedback instead of preview so the text matches perfectly */}
                    <p className="font-serif text-lg italic leading-relaxed text-[#3c232c] line-clamp-4 sm:text-xl">
                      "{item.feedback}"
                    </p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c] opacity-0 transition-opacity group-hover:opacity-100">
                      Click to read full story
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-t border-[#e3d1d1]/50 pt-5">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f8cdb4]/30 font-serif text-sm font-bold text-[#ad6a6c] sm:size-12 sm:text-lg">
                      {getInitials(item.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-[#3c232c] sm:text-base">
                          {item.name}
                        </h4>
                        <span title="Verified Client">
                          <Icon
                            icon="ph:seal-check-fill"
                            className="text-sm text-[#ad6a6c] sm:text-base"
                          />
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-[#3c232c]/60 sm:text-xs">
                        {item.service}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Carousel Navigation Arrows */}
            <div className="mt-2 flex items-center justify-end gap-3 pr-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="grid size-10 place-items-center rounded-full border border-[#efdad0] bg-white/60 text-[#3c232c] shadow-sm transition hover:border-[#ad6a6c] hover:bg-white hover:text-[#ad6a6c] sm:size-12"
              >
                <Icon
                  icon="ph:arrow-left-bold"
                  className="text-base sm:text-lg"
                />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="grid size-10 place-items-center rounded-full border border-[#efdad0] bg-white/60 text-[#3c232c] shadow-sm transition hover:border-[#ad6a6c] hover:bg-white hover:text-[#ad6a6c] sm:size-12"
              >
                <Icon
                  icon="ph:arrow-right-bold"
                  className="text-base sm:text-lg"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          READ FULL REVIEW MODAL
      ========================================================= */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3c232c]/50 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setSelectedTestimonial(null)}
          >
            <motion.article
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-[#f9f6f3] shadow-2xl sm:rounded-[2.5rem]"
            >
              <div className="flex items-center justify-between border-b border-[#efdad0] bg-white/80 px-5 py-4 backdrop-blur-md sm:px-8 sm:py-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#ad6a6c] sm:text-[10px]">
                    Client Feedback
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold text-[#3c232c] sm:text-2xl">
                    {selectedTestimonial.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTestimonial(null)}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-[#efdad0] bg-white text-[#3c232c] transition-colors hover:bg-[#e3d1d1] hover:text-[#ad6a6c] sm:size-10"
                >
                  <Icon icon="ph:x-bold" className="text-base sm:text-lg" />
                </button>
              </div>

              <div className="p-5 sm:p-10">
                <div className="mb-5 flex gap-1 text-[#ad6a6c]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      icon={
                        i < selectedTestimonial.rating
                          ? "ph:star-fill"
                          : "ph:star"
                      }
                      className="text-lg sm:text-xl"
                    />
                  ))}
                </div>

                <div className="relative">
                  <Icon
                    icon="ph:quotes-fill"
                    className="absolute -left-2 -top-2 text-3xl text-[#f8cdb4]/50 sm:-left-3 sm:-top-3 sm:text-4xl"
                  />
                  {/* Full feedback matches perfectly */}
                  <p className="relative z-10 font-serif text-lg leading-relaxed text-[#3c232c] sm:text-xl sm:leading-relaxed">
                    "{selectedTestimonial.feedback}"
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#efdad0] bg-white/60 p-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c] sm:text-xs">
                      Service Provided
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#3c232c] sm:text-base">
                      {selectedTestimonial.service}
                    </p>
                  </div>
                  <div className="hidden h-8 w-px bg-[#e3d1d1] sm:block" />
                  <div className="h-px w-full bg-[#e3d1d1] sm:hidden" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c] sm:text-xs">
                      Project Date
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#3c232c] sm:text-base">
                      {selectedTestimonial.date}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          SUBMIT REVIEW PORTAL MODAL
      ========================================================= */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3c232c]/50 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setIsReviewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90svh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] bg-[#f9f6f3] shadow-2xl sm:rounded-[2.5rem]"
            >
              <div className="flex items-center justify-between border-b border-[#efdad0] bg-white/80 px-5 py-4 backdrop-blur-md sm:px-8 sm:py-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#3c232c] sm:text-2xl">
                    Share Your Experience
                  </h3>
                  <p className="mt-1 text-[11px] font-medium text-[#ad6a6c] sm:text-xs">
                    Your feedback helps me grow and serve better.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-[#efdad0] bg-white text-[#3c232c] transition-colors hover:bg-[#e3d1d1] hover:text-[#ad6a6c] sm:size-10"
                >
                  <Icon icon="ph:x-bold" className="text-base sm:text-lg" />
                </button>
              </div>

              <div className="overflow-y-auto p-5 sm:p-8">
                <form
                  className="flex flex-col gap-4 sm:gap-5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/80 sm:text-xs">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Maria Theresa Yu"
                        className="rounded-xl border border-[#efdad0] bg-white px-4 py-3 text-sm text-[#3c232c] outline-none transition focus:border-[#ad6a6c] focus:ring-1 focus:ring-[#ad6a6c]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/80 sm:text-xs">
                        Service
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Graphic Design"
                        className="rounded-xl border border-[#efdad0] bg-white px-4 py-3 text-sm text-[#3c232c] outline-none transition focus:border-[#ad6a6c] focus:ring-1 focus:ring-[#ad6a6c]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/80 sm:text-xs">
                      Rating
                    </label>
                    <div className="flex gap-1 sm:gap-2">
                      {/* FIXED: Interactive stars that light up correctly */}
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition hover:scale-110"
                        >
                          <Icon
                            icon={
                              (hoverRating || rating) >= star
                                ? "ph:star-fill"
                                : "ph:star"
                            }
                            className={`text-2xl sm:text-3xl transition-colors ${(hoverRating || rating) >= star ? "text-[#ad6a6c]" : "text-[#e3d1d1]"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/80 sm:text-xs">
                      Your Feedback
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How was your experience working with me?"
                      className="resize-none rounded-xl border border-[#efdad0] bg-white px-4 py-3 text-sm text-[#3c232c] outline-none transition focus:border-[#ad6a6c] focus:ring-1 focus:ring-[#ad6a6c]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    onClick={() => {
                      alert(
                        `Rating saved as: ${rating} Stars! \nThis will connect to Supabase backend soon!`,
                      );
                      setIsReviewModalOpen(false);
                    }}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ad6a6c] px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-[#3c232c] hover:shadow-lg hover:shadow-[#3c232c]/20 sm:py-4"
                  >
                    Submit Review{" "}
                    <Icon icon="ph:paper-plane-tilt-bold" className="text-lg" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
