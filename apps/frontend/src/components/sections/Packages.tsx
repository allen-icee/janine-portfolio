import { BadgeCheck } from "lucide-react";
import { packages } from "../../data/site";

export function Packages() {
  if (!packages?.length) return null;

  return (
    <section className="bg-[#f0eeea] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#e6a889]">
            Packages
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[#a5857a] sm:text-6xl">
            Flexible support tiers.
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {packages.map((item) => (
            <article
              key={item.name}
              className={`rounded-[2rem] border p-8 transition hover:-translate-y-1 ${
                item.highlighted
                  ? "border-[#e6a889] bg-[#e6a889] text-white shadow-xl shadow-[#e6a889]/20"
                  : "border-[#efdad0] bg-white/50 text-[#a5857a] hover:bg-white"
              }`}
            >
              <p
                className={`text-sm font-bold uppercase tracking-wide ${item.highlighted ? "opacity-90" : "text-[#e6a889]"}`}
              >
                {item.name}
              </p>
              <p className="mt-3 font-serif text-4xl">{item.price}</p>
              <p
                className={`mt-4 min-h-16 leading-7 ${item.highlighted ? "opacity-90" : "opacity-80"}`}
              >
                {item.description}
              </p>
              <ul className="mt-8 space-y-4">
                {item.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <BadgeCheck
                      size={18}
                      className={`mt-0.5 shrink-0 ${item.highlighted ? "text-white" : "text-[#e6a889]"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
