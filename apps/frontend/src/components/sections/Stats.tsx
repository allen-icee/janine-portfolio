import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { stats } from "../../data/site";

const statIcons = [
  "ph:briefcase-duotone",
  "ph:users-three-duotone",
  "ph:star-duotone",
  "ph:trend-up-duotone",
];

export function Stats() {
  if (!stats?.length) return null;

  return (
    // Updated to #f0eeea to maintain the alternating pattern
    <section className="relative bg-[#efe9e5] px-4 py-10 sm:px-6 lg:px-8">
      {" "}
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="h-[240px] w-[240px] rounded-full bg-[#f8cdb4]/30 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group relative rounded-xl border border-[#efdad0] bg-white/60 px-4 py-5 text-center shadow-sm backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#f8cdb4]/0 via-[#f8cdb4]/10 to-[#ad6a6c]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#ad6a6c] to-[#3c232c] shadow-md">
                <Icon
                  icon={statIcons[index % statIcons.length]}
                  className="text-[18px] text-white"
                />
              </div>

              <p className="font-serif text-xl font-bold text-[#3c232c] sm:text-2xl lg:text-3xl">
                {stat.value}
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c] sm:text-xs">
                {stat.label}
              </p>

              <div className="mx-auto mt-3 h-[3px] w-8 rounded-full bg-gradient-to-r from-[#f8cdb4] to-[#ad6a6c] transition-all duration-300 group-hover:w-12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
