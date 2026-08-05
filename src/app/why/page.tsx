import type { Metadata } from "next";
import Link from "next/link";
import { AudienceCarousel } from "@/components/marketing/audience-carousel";
import { CommissionCalculator } from "@/components/marketing/commission-calculator";
import {
  ChatIcon,
  CheckVerifiedIcon,
  PinIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Why ${siteConfig.name} — Real Photos, Zero Brokerage & Verified Listings`,
  description: `Every listing on ${siteConfig.name} is personally verified by our team. Honest rent, direct owner connections, and zero brokerage games in ${siteConfig.city}.`,
  alternates: { canonical: "/why" },
};

const TICKER = [
  "Physically Verified",
  "100% Real Photos",
  "Honest Prices",
  "Zero Brokerage",
  "Number Kept Private",
  "Local Guwahati Team",
  "Approved Before Publishing",
  "Direct Owner Connection",
];

const PILLARS = [
  {
    icon: ShieldCheckIcon,
    title: "Vetted Before Going Live",
    body: "No automated spam or fake listings. Our local Guwahati team reviews and inspects every listing before it publishes.",
  },
  {
    icon: SparklesIcon,
    title: "100% Real Room Photos",
    body: "No stock images or old brochures. The actual room and building you see online is exact to reality when you visit.",
  },
  {
    icon: PinIcon,
    title: "Verified Map Locations",
    body: "Approximate map radius publicly for host security, exact address provided once a visit is scheduled.",
  },
  {
    icon: UserIcon,
    title: "Privacy Protected",
    body: "Your phone number stays safe. We never publish or sell your contact info to aggressive third-party brokers.",
  },
  {
    icon: ChatIcon,
    title: "Real Local Team On Call",
    body: "Stuck choosing between two places? Call or message our team. We know Guwahati neighbourhoods inside out.",
  },
  {
    icon: WhatsAppIcon,
    title: "Instant WhatsApp Enquiry",
    body: "No signup walls, no mandatory app downloads, and no endless OTP verification loops.",
  },
];

const STEPS = [
  {
    title: "Host Submits Property",
    body: "Owner submits property photos, rent, deposit rules, and exact map location.",
  },
  {
    title: "Verification Inspection",
    body: "Our team audits photos, amenities, and rent against physical inspection standards.",
  },
  {
    title: "Photo & Locality Audit",
    body: "We verify actual room photos and confirm accurate locality boundaries.",
  },
  {
    title: "Approval & Publication",
    body: "Only fully verified properties are published live on FindMySpace.",
  },
];

const CHECKS = [
  "Rent & Deposit",
  "Real Photos",
  "Amenities",
  "Locality Bounds",
  "Host Identity",
];

const COMPETITORS = ["Airbnb", "OLX", "MagicBricks"] as const;
const COMPARISON_REVIEWED = "August 2026";

type Cell = "yes" | "varies" | "no" | { text: string; sub?: string };

const COMPARISON: { feature: string; us: Cell; them: [Cell, Cell, Cell] }[] = [
  {
    feature: "PG & Rental host listings",
    us: { text: "100% Free", sub: "unlimited listings" },
    them: [
      { text: "N/A", sub: "short-stay focus" },
      { text: "Varies", sub: "pay for ad packages" },
      { text: "Varies", sub: "pay for listing packages" },
    ],
  },
  {
    feature: "Renter brokerage fee",
    us: { text: "₹0", sub: "100% free for renters" },
    them: [
      { text: "14% - 16%", sub: "guest service fee" },
      { text: "Varies", sub: "brokerage charged by agents" },
      { text: "Varies", sub: "brokerage charged by agents" },
    ],
  },
  { feature: "PGs & shared rooms", us: "yes", them: ["no", "yes", "yes"] },
  { feature: "Rental flats & houses", us: "yes", them: ["varies", "yes", "yes"] },
  { feature: "Homestays & short stays", us: "yes", them: ["yes", "no", "no"] },
  { feature: "Guwahati-focused team", us: "yes", them: ["no", "no", "no"] },
  { feature: "Direct WhatsApp enquiry", us: "yes", them: ["no", "no", "no"] },
  { feature: "Owner number kept off open web", us: "yes", them: ["yes", "no", "varies"] },
];

const CELL_LABEL: Record<"yes" | "varies" | "no", string> = {
  yes: "Yes",
  varies: "Varies",
  no: "Not offered",
};

const FAQS = [
  {
    q: "How does FindMySpace verify properties?",
    a: "Our local Guwahati team manually reviews every single property submission — checking photos, rent amounts, amenities, and location pins before publishing.",
  },
  {
    q: "Does FindMySpace charge renters any fee?",
    a: "No! Browsing, enquiring, visiting, and renting through FindMySpace is 100% free for renters.",
  },
  {
    q: "What does it cost for property owners to list?",
    a: "Listing PGs and rental properties is 100% free with unlimited postings. For homestays, listing is free and we charge a flat 12% commission only on confirmed bookings (compared to 15%–25%+ on traditional platforms).",
  },
  {
    q: "How is my phone number protected?",
    a: "Unlike classifieds platforms that publish your phone number to thousands of brokers, we handle initial enquiries and introduce you directly when there is genuine mutual interest.",
  },
  {
    q: "Why is the map location shown as an approximate area?",
    a: "We collect exact map coordinates from hosts to verify location, but publicly display an approximate circle for host privacy and security. You receive exact coordinates once a visit is scheduled.",
  },
];

function ComparisonMark({
  value,
  highlight,
  decorative,
}: {
  value: Cell;
  highlight?: boolean;
  decorative?: boolean;
}) {
  if (typeof value === "object") {
    return (
      <span className="block leading-tight">
        <span
          className={`text-sm font-black ${
            highlight ? "text-emerald-600" : "text-zinc-900"
          }`}
        >
          {value.text}
        </span>
        {value.sub && (
          <span className="mt-0.5 block text-[11px] font-normal text-zinc-400">
            {value.sub}
          </span>
        )}
      </span>
    );
  }

  const styles: Record<"yes" | "varies" | "no", string> = {
    yes: highlight ? "bg-emerald-600 text-white" : "bg-zinc-900 text-white",
    varies: "bg-zinc-100 text-zinc-500",
    no: "bg-zinc-100/60 text-zinc-300",
  };
  const glyph = { yes: "✓", varies: "~", no: "–" }[value];

  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-black shadow-xs ${styles[value]}`}
    >
      <span aria-hidden="true">{glyph}</span>
      {!decorative && <span className="sr-only">{CELL_LABEL[value]}</span>}
    </span>
  );
}

export default function WhyPage() {
  return (
    <div className="bg-zinc-50/50">
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative overflow-hidden bg-zinc-950 pb-24 pt-20 sm:pb-28 sm:pt-28">
        {/* Animated Background Ambient Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-48 -top-48 h-[36rem] w-[36rem] animate-pulse rounded-full bg-gradient-to-br from-brand-500/30 via-indigo-500/20 to-purple-500/10 blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-56 right-0 h-[34rem] w-[34rem] animate-pulse rounded-full bg-gradient-to-tl from-emerald-500/20 via-brand-500/15 to-transparent blur-[140px]"
        />

        <div className="relative mx-auto max-w-[1360px] px-6 text-center sm:px-10 lg:px-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-extrabold text-brand-200 backdrop-blur-xl shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Why Choose {siteConfig.name}
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-[1.1]">
              Find your space in {siteConfig.city}.
              <br />
              <span className="bg-gradient-to-r from-brand-200 via-brand-400 to-indigo-300 bg-clip-text text-transparent">
                Without the brokerage games.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-xl">
              Every listing is personally verified by our local team. Real photos, transparent prices, and zero broker spam.
            </p>

            {/* Quick Feature Stats */}
            <div className="mt-9 flex flex-wrap justify-center gap-3 text-xs font-extrabold text-zinc-200">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md shadow-xs">
                <CheckVerifiedIcon className="h-4 w-4 text-emerald-400" />
                <span>100% Physically Verified</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md shadow-xs">
                <SparklesIcon className="h-4 w-4 text-brand-300" />
                <span>Zero Renter Brokerage</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md shadow-xs">
                <WhatsAppIcon className="h-4 w-4 text-emerald-400" />
                <span>Direct WhatsApp Enquiry</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col justify-center gap-3.5 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-8 text-sm font-extrabold text-white shadow-2xl shadow-brand-950/60 transition duration-300 hover:scale-105 active:scale-95"
              >
                <SearchIcon className="h-4.5 w-4.5" />
                Browse Properties
              </Link>
              <Link
                href="/host"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 text-sm font-extrabold text-white backdrop-blur-xl transition duration-300 hover:bg-white/20 active:scale-95"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>

        {/* Continuous Ticker */}
        <div className="relative mt-20 flex overflow-hidden border-y border-white/10 bg-white/5 py-4 backdrop-blur-md [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex shrink-0 items-center hover:[animation-play-state:paused]">
            {[0, 1, 2, 3].map((copy) => (
              <ul key={copy} aria-hidden={copy > 0} className="flex shrink-0 items-center">
                {TICKER.map((item) => (
                  <li key={item} className="flex shrink-0 items-center gap-2 px-7 text-xs font-extrabold uppercase tracking-widest text-zinc-300">
                    <CheckVerifiedIcon className="h-4 w-4 text-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- STATEMENT SECTION ---------- */}
      <section className="mx-auto max-w-[1360px] px-6 py-20 text-center sm:px-10 sm:py-28 lg:px-16">
        <p className="mx-auto max-w-3xl text-3xl font-black leading-tight tracking-tight text-zinc-900 sm:text-5xl">
          Nothing here publishes itself.
          <br />
          <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 bg-clip-text text-transparent">
            Every listing goes through a real person first.
          </span>
        </p>
      </section>

      {/* ---------- 6 PILLARS GRID ---------- */}
      <section className="border-y border-zinc-200/90 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-16">
          <div className="mx-auto mb-14 max-w-lg text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
              Our Core Pillars
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Built on trust, verified in person
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-[2.5rem] border border-zinc-200/90 bg-zinc-50/50 p-8 transition duration-300 hover:-translate-y-2 hover:border-brand-300 hover:bg-white hover:shadow-2xl hover:shadow-brand-950/10"
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-100/50 opacity-0 transition duration-300 group-hover:opacity-100"
                />
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-700 text-white shadow-xl shadow-brand-600/30 transition duration-300 group-hover:scale-110">
                  <pillar.icon className="h-6.5 w-6.5" />
                </span>
                <h3 className="relative mt-6 text-xl font-extrabold text-zinc-900">
                  {pillar.title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-zinc-600">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- INTERACTIVE SAVINGS CALCULATOR ---------- */}
      <section className="mx-auto max-w-[1360px] px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <CommissionCalculator />
        </div>
      </section>

      {/* ---------- SIDE BY SIDE COMPARISON ---------- */}
      <section className="border-y border-zinc-200/90 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-16">
          <div className="mx-auto mb-12 max-w-lg text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
              The Difference
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Side-by-side comparison
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              How FindMySpace compares to traditional listing platforms
            </p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-zinc-200/90 bg-white shadow-xl">
            <div className="no-scrollbar overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/70">
                    <th scope="col" className="sticky left-0 z-10 bg-zinc-50/95 px-6 py-5 text-xs font-extrabold uppercase tracking-widest text-zinc-500">
                      Feature
                    </th>
                    <th scope="col" className="bg-brand-50/90 px-6 py-5 text-center text-sm font-black text-brand-800">
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldCheckIcon className="h-4 w-4" />
                        {siteConfig.name}
                      </span>
                    </th>
                    {COMPETITORS.map((name) => (
                      <th scope="col" key={name} className="px-6 py-5 text-center text-sm font-bold text-zinc-600">
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/80">
                      <th scope="row" className="sticky left-0 z-10 bg-white px-6 py-4.5 text-sm font-bold text-zinc-900">
                        {row.feature}
                      </th>
                      <td className="bg-brand-50/40 px-6 py-4.5 text-center">
                        <ComparisonMark value={row.us} highlight />
                      </td>
                      {row.them.map((value, index) => (
                        <td key={COMPETITORS[index]} className="px-6 py-4.5 text-center">
                          <ComparisonMark value={value} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mx-auto mt-5 max-w-4xl text-center text-xs font-medium text-zinc-400">
            Based on publicly available feature specifications reviewed {COMPARISON_REVIEWED}.
          </p>
        </div>
      </section>

      {/* ---------- VERIFICATION PIPELINE ---------- */}
      <section className="mx-auto max-w-[1360px] px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
              Our Process
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              What every listing goes through
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
              4 rigorous verification steps before any property appears on FindMySpace.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {CHECKS.map((check) => (
                <li key={check} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs">
                  <CheckVerifiedIcon className="h-3.5 w-3.5 text-emerald-600" />
                  {check}
                </li>
              ))}
            </ul>
          </div>

          <ol className="relative space-y-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="group relative flex gap-6 rounded-3xl border border-zinc-200/90 bg-white p-7 shadow-xs transition duration-300 hover:border-brand-300 hover:shadow-lg">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-base font-black text-white shadow-md transition duration-300 group-hover:bg-brand-600">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-zinc-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- AUDIENCE CAROUSEL ---------- */}
      <section className="border-y border-zinc-200/90 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-16">
          <div className="mx-auto mb-12 max-w-lg text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
              Built For Everyone
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Both sides of the door
            </h2>
          </div>
          <div className="mx-auto max-w-4xl">
            <AudienceCarousel />
          </div>
        </div>
      </section>

      {/* ---------- FAQ ACCORDION ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="mb-12 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
            Got Questions?
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-zinc-100 overflow-hidden rounded-[2.5rem] border border-zinc-200/90 bg-white shadow-lg">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-7 py-5 text-sm sm:text-base font-extrabold text-zinc-900 transition hover:bg-zinc-50 [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition duration-300 group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="px-7 pb-6 text-sm leading-relaxed text-zinc-600">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- CLOSING CTA ---------- */}
      <section className="mx-auto max-w-[1360px] px-6 pb-24 pt-8 sm:px-10 lg:px-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-950 px-8 py-14 text-center shadow-2xl sm:px-14 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-lg backdrop-blur-md">
            <WhatsAppIcon className="h-7 w-7" />
          </span>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Ready to find your verified space?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-100 sm:text-base">
            Browse verified PGs, rental flats, and homestays across {siteConfig.city}.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/listings"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-sm font-extrabold text-brand-700 shadow-2xl transition duration-300 hover:bg-brand-50 active:scale-95"
            >
              <SearchIcon className="h-4.5 w-4.5" />
              Browse Properties
            </Link>
            {siteConfig.whatsappNumber && (
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 text-sm font-extrabold text-white backdrop-blur-md transition duration-300 hover:bg-white/20 active:scale-95"
              >
                <WhatsAppIcon className="h-4.5 w-4.5" />
                Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
