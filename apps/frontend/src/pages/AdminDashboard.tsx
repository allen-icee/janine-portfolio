import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  CalendarClock,
  HelpCircle,
  Image,
  Inbox,
  MessageSquareQuote,
  MoonStar,
  PanelsTopLeft,
  CircleDollarSign,
  Sparkles,
  Sun,
  Sunrise,
} from "lucide-react";
import { AdminGuard } from "../components/admin/AdminGuard";
import { AdminShell } from "../components/admin/AdminShell";

const adminCards = [
  {
    title: "Portfolio",
    description: "Create projects, manage categories, and upload cover images.",
    href: "/admin/portfolio",
    icon: PanelsTopLeft,
  },
  {
    title: "Proofs",
    description: "Upload client proof screenshots and organize proof entries.",
    href: "/admin/proofs",
    icon: Image,
  },
  {
    title: "Rates",
    description: "Manage service categories, groups, and public rate rows.",
    href: "/admin/rates",
    icon: CircleDollarSign,
  },
  {
    title: "Testimonials",
    description: "Review client feedback and remove entries when needed.",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    title: "FAQs",
    description:
      "Create, edit, reorder, and publish frequently asked questions.",
    href: "/admin/faqs",
    icon: HelpCircle,
  },
  {
    title: "Inquiries",
    description: "Read website messages and mark requests as handled.",
    href: "/admin/inquiries",
    icon: Inbox,
  },
];

type GreetingTone = "morning" | "afternoon" | "evening";

function getManilaDateParts(date: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(date),
  );

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const timeLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const greetingTone: GreetingTone =
    hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  return {
    greeting,
    greetingTone,
    dateLabel,
    timeLabel,
  };
}

const greetingStyles = {
  morning: {
    icon: Sunrise,
    className: "bg-[#fff7df] text-[#b7791f]",
  },
  afternoon: {
    icon: Sun,
    className: "bg-[#fff0e6] text-[#c05621]",
  },
  evening: {
    icon: MoonStar,
    className: "bg-[#f0edf8] text-[#6b46a3]",
  },
};

export function AdminDashboard() {
  const [now, setNow] = useState(() => new Date());

  const manilaDate = useMemo(() => getManilaDateParts(now), [now]);

  const GreetingIcon = greetingStyles[manilaDate.greetingTone].icon;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <AdminGuard>
      <AdminShell title="Dashboard" description="Dashboard Management">
        {/* TOP HEADER */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#efdad0] bg-gradient-to-r from-[#3c232c] to-[#ad6a6c] text-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">
              <div className="hidden size-12 place-items-center rounded-full bg-white/12 text-white sm:grid">
                <Sparkles size={24} />
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  Admin Dashboard Online
                  <span className="relative flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8f3c6] opacity-75" />

                    <span className="relative inline-flex size-3 rounded-full bg-[#75e69a]" />
                  </span>
                </div>

                <p className="mt-1 text-sm text-white/75">
                  Portfolio, rates, proofs, feedback, FAQs, and inquiries are
                  ready to manage.
                </p>
              </div>
            </div>

            {/* CLOCK CARD */}
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-left shadow-lg backdrop-blur-md sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                {manilaDate.dateLabel}
              </p>

              <p className="mt-2 flex items-center gap-2 font-mono text-3xl font-extrabold tracking-tight text-white drop-shadow-md sm:justify-end">
                <CalendarClock size={22} className="opacity-80" />
                {manilaDate.timeLabel}
              </p>

              <p className="mt-1 text-xs font-medium tracking-wide text-white/65">
                Philippine Time
              </p>
            </div>
          </div>
        </div>

        {/* GREETING CARD */}
        <div className="mb-6 rounded-2xl border-l-4 border-[#ad6a6c] bg-white/70 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#3c232c] sm:text-3xl">
                {manilaDate.greeting}, Admin.
              </h1>

              <p className="mt-1 text-sm leading-6 text-[#3c232c]/62">
                Welcome back to JaneDesk content management.
              </p>
            </div>

            <div
              className={`hidden size-14 shrink-0 place-items-center rounded-full sm:grid ${greetingStyles[manilaDate.greetingTone].className}`}
            >
              <GreetingIcon size={30} />
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#3c232c]/60">
          Quick Actions
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {adminCards.map((card) => (
            <Link
              key={card.title}
              to={card.href}
              className="group rounded-2xl border border-[#efdad0] bg-white/60 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#ad6a6c]/60 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#f8cdb4]/25 text-[#ad6a6c] transition group-hover:bg-[#ad6a6c] group-hover:text-white">
                  <card.icon size={20} />
                </div>

                <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                  Open
                </span>
              </div>

              <h2 className="mt-5 font-serif text-xl font-bold text-[#3c232c]">
                {card.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#3c232c]/60">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
