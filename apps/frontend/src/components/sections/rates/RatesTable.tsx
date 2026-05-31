// apps\frontend\src\components\sections\rates\RatesTable.tsx
import { Icon } from "@iconify/react";
import type { RateServiceGroup } from "../../../types/content";

type RatesTableProps = {
  group: RateServiceGroup;
};

export function RatesTable({ group }: RatesTableProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#efdad0] bg-white/70 shadow-sm backdrop-blur-md">
      <div className="border-b border-[#efdad0]/60 bg-white/55 px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold leading-tight text-[#3c232c]">
              {group.title}
            </h3>
            {group.description && (
              <p className="mt-1 text-xs leading-5 text-[#3c232c]/60">
                {group.description}
              </p>
            )}
          </div>
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f8cdb4]/30 text-[#ad6a6c]">
            <Icon icon="ph:list-checks-duotone" className="text-base" />
          </div>
        </div>

        {group.note && (
          <p className="mt-3 rounded-xl bg-[#f8cdb4]/20 px-3 py-2 text-[11px] font-semibold leading-5 text-[#3c232c]/70">
            {group.note}
          </p>
        )}
      </div>

      <div className="divide-y divide-[#efdad0]/45">
        {group.rates.map((item) => (
          <div
            key={item.id ?? `${group.title}-${item.name}`}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 transition hover:bg-white/75"
          >
            <p className="min-w-0 text-sm font-semibold leading-5 text-[#3c232c]/82">
              {item.name}
            </p>
            <p
              className={`whitespace-nowrap rounded-full px-3 py-1 text-right text-[11px] font-extrabold ${
                item.rate.toLowerCase().includes("included")
                  ? "bg-[#f8cdb4]/30 text-[#3c232c]/70"
                  : "bg-[#ad6a6c]/10 text-[#ad6a6c]"
              }`}
            >
              {item.rate}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
