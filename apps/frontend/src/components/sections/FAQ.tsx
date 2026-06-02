// apps\frontend\src\components\sections\FAQ.tsx
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs as fallbackFaqs } from "../../data/site";

type FAQProps = {
  faqs?: {
    question: string;
    answer: string;
  }[];
};

export function FAQ({ faqs = fallbackFaqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      setDisplayCount(window.innerWidth < 640 ? 3 : 6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const visibleFaqs = isExpanded ? faqs : faqs.slice(0, displayCount);
  const hasMore = faqs.length > displayCount;

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#efe9e5] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#f8cdb4]/20 blur-[120px]" />
      <div className="absolute bottom-10 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-[#e3d1d1]/30 blur-[100px]" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-5xl font-bold tracking-tight text-[#3c232c] sm:text-6xl lg:text-7xl">
            FAQs
          </h2>
          <p className="mt-4 font-serif text-lg font-bold italic tracking-wide text-[#ad6a6c] sm:text-xl">
            Frequently Asked Questions.
          </p>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visibleFaqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.button
                  key={faq.question}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => toggleFaq(index)}
                  className={`group relative flex w-full flex-col overflow-hidden rounded-[2.5rem] border p-6 text-left shadow-sm backdrop-blur-md transition-all duration-500 sm:p-8 ${
                    isOpen
                      ? "border-[#ad6a6c] bg-white shadow-xl lg:scale-[1.02]"
                      : "border-[#efdad0] bg-white/50 hover:-translate-y-1 hover:bg-white/80 hover:shadow-md"
                  }`}
                >
                  <Icon
                    icon="ph:question-duotone"
                    className={`absolute -bottom-6 -right-6 text-8xl transition-all duration-500 ${
                      isOpen
                        ? "text-[#f8cdb4]/10 scale-125"
                        : "text-[#e3d1d1]/30 group-hover:scale-110"
                    }`}
                  />

                  <div className="relative z-10 flex w-full items-start justify-between gap-4">
                    <motion.h3
                      layout="position"
                      className={`flex-1 break-words pr-2 text-left font-serif text-lg font-bold leading-snug transition-colors sm:text-xl ${
                        isOpen ? "text-[#ad6a6c]" : "text-[#3c232c]"
                      }`}
                    >
                      {faq.question}
                    </motion.h3>

                    <motion.div
                      layout="position"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: "backOut" }}
                      className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors ${
                        isOpen
                          ? "border-[#ad6a6c] bg-[#ad6a6c] text-white"
                          : "border-[#e3d1d1] bg-white text-[#3c232c]"
                      }`}
                    >
                      <Icon
                        icon={isOpen ? "ph:minus-bold" : "ph:plus-bold"}
                        className="text-sm"
                      />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="relative z-10 w-full overflow-hidden"
                      >
                        <div className="mb-5 h-px w-full bg-[#e3d1d1]/60" />
                        <p className="text-sm leading-relaxed text-[#3c232c]/85 sm:text-base">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {hasMore && (
          <motion.div layout className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-[#e3d1d1] bg-white/50 px-8 py-3.5 text-sm font-bold text-[#3c232c] transition-all hover:border-[#ad6a6c] hover:bg-white"
            >
              {isExpanded ? (
                <>
                  <Icon
                    icon="ph:caret-up-bold"
                    className="text-lg text-[#ad6a6c] transition-transform group-hover:-translate-y-1"
                  />
                  Show Less
                </>
              ) : (
                <>
                  <Icon
                    icon="ph:caret-down-bold"
                    className="text-lg text-[#ad6a6c] transition-transform group-hover:translate-y-1"
                  />
                  Show All FAQs ({faqs.length})
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
