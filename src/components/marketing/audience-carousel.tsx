"use client";

import Link from "next/link";
import {
  type ComponentType,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { HomeIcon, SearchIcon, SuitcaseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Audience = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  headline: string;
  points: string[];
  cta: { label: string; href: string };
};

const AUDIENCES: Audience[] = [
  {
    id: "renters",
    label: "Renters & Students",
    icon: SearchIcon,
    headline: "See verified places worth visiting.",
    points: [
      "Photos match the actual room & building",
      "Rent and deposit stated upfront with zero brokerage",
      "Your phone number stays protected from broker spam",
      "Local team arranges site visits for you",
    ],
    cta: { label: "Browse verified listings", href: "/listings" },
  },
  {
    id: "owners",
    label: "PG & Rental Owners",
    icon: HomeIcon,
    headline: "Unlimited free listings with real enquiries.",
    points: [
      "Listing is 100% free with no package limits",
      "We screen every enquiry before introducing tenants",
      "Your phone number stays private until mutual interest",
      "No brokerage cut on your rental income",
    ],
    cta: { label: "List your property free", href: "/host" },
  },
  {
    id: "hosts",
    label: "Homestay Hosts",
    icon: SuitcaseIcon,
    headline: "Flat 12% fee with guests who turn up.",
    points: [
      "Save 3.5%–13%+ compared to 15%–25% competitor fees",
      "Local visibility across Guwahati",
      "Seamless enquiries handled directly over WhatsApp",
      "Dedicated local support when you need help",
    ],
    cta: { label: "Start hosting homestays", href: "/host" },
  },
];

const INTERVAL_MS = 6000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );
}

export function AudienceCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(
      () => setActive((index) => (index + 1) % AUDIENCES.length),
      INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);

  const current = AUDIENCES[active];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="overflow-hidden rounded-[2.5rem] border border-zinc-200/90 bg-white shadow-xl shadow-zinc-900/5"
    >
      {/* Tab Switcher */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-zinc-100 bg-zinc-50/60 p-3">
        {AUDIENCES.map((audience, index) => (
          <button
            key={audience.id}
            type="button"
            aria-pressed={index === active}
            onClick={() => setActive(index)}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl px-5 text-xs font-bold transition-all duration-300",
              index === active
                ? "bg-zinc-900 text-white shadow-md scale-[1.02]"
                : "text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900",
            )}
          >
            <audience.icon className="h-4 w-4" />
            {audience.label}
          </button>
        ))}
      </div>

      <div key={current.id} className="animate-fade-up p-7 sm:p-9">
        <h3 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
          {current.headline}
        </h3>
        <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
          {current.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 text-xs sm:text-sm font-medium leading-relaxed text-zinc-700"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shadow-2xs">
                ✓
              </span>
              {point}
            </li>
          ))}
        </ul>
        <Link
          href={current.cta.href}
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 text-xs font-extrabold text-white shadow-md transition duration-300 hover:bg-brand-500 active:scale-95 sm:text-sm"
        >
          {current.cta.label}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Slide Indicators */}
      <div aria-hidden="true" className="flex items-center gap-2 px-7 pb-7 sm:px-9">
        {AUDIENCES.map((audience, index) => (
          <span
            key={audience.id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              index === active ? "bg-brand-600 scale-y-125" : "bg-zinc-200",
            )}
          />
        ))}
      </div>
    </div>
  );
}
