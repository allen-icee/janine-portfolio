import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "../../data/site";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#f9f6f3] px-4 py-20 sm:px-6 lg:px-8 lg:py-32"
    >
      {/* Background Ambience */}
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#f8cdb4]/20 blur-[120px]" />
      <div className="absolute bottom-10 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-[#e3d1d1]/30 blur-[100px]" />

      <div className="mx-auto max-w-7xl">
        {/* =========================================================
            HEADER: Centered, Massive, Editorial
        ========================================================= */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="grid size-14 place-items-center rounded-full bg-[#ad6a6c]/10 text-[#ad6a6c]">
              <Icon icon="ph:chat-teardrop-text-duotone" className="text-3xl" />
            </div>
          </div>
          <h2 className="font-serif text-5xl font-bold tracking-tight text-[#3c232c] sm:text-7xl lg:text-8xl">
            FAQ.
          </h2>
          <p className="mt-4 font-serif text-lg font-bold italic tracking-wide text-[#ad6a6c] sm:text-xl">
            Clear answers before you reach out.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#3c232c]/70 sm:text-base">
            The goal is to reduce uncertainty. Find quick answers regarding my
            process, capabilities, and how we can collaborate effectively.
          </p>
        </div>

        {/* =========================================================
            THE MAGIC GRID: Dynamic Expanding Bento Layout
        ========================================================= */}
        {/* items-start prevents sibling cards from stretching awkwardly */}
        <motion.div
          layout
          className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.button
                key={faq.question}
                layout // This tells Framer Motion to automatically animate size changes
                onClick={() => toggleFaq(index)}
                className={`group relative flex w-full flex-col overflow-hidden rounded-[2.5rem] border p-6 text-left shadow-sm backdrop-blur-md transition-all duration-500 sm:p-8 ${
                  isOpen
                    ? "border-[#ad6a6c] bg-white shadow-xl lg:scale-[1.02]"
                    : "border-[#efdad0] bg-white/50 hover:-translate-y-1 hover:bg-white/80 hover:shadow-md"
                }`}
              >
                {/* Decorative Watermark Icon */}
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
                    className={`font-serif text-lg font-bold leading-snug transition-colors sm:text-xl ${
                      isOpen ? "text-[#ad6a6c]" : "text-[#3c232c]"
                    }`}
                  >
                    {faq.question}
                  </motion.h3>

                  {/* Plus/Minus Indicator */}
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

                {/* The Expanding Answer Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="relative z-10 w-full overflow-hidden"
                    >
                      <div className="h-px w-full bg-[#e3d1d1]/60 mb-5" />
                      <p className="text-sm leading-relaxed text-[#3c232c]/85 sm:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>

        {/* CTA at the bottom */}
        <motion.div layout className="mt-16 text-center">
          <p className="text-sm font-medium text-[#3c232c]/80 mb-4">
            Still have a question?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#e3d1d1] bg-white/50 px-8 py-3.5 text-sm font-bold text-[#3c232c] transition-all hover:border-[#ad6a6c] hover:bg-white"
          >
            <Icon
              icon="ph:paper-plane-tilt-bold"
              className="text-lg text-[#ad6a6c]"
            />
            Send me a message
          </a>
        </motion.div>
      </div>
    </section>
  );
}
