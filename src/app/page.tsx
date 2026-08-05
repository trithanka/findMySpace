import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LocalityTile } from "@/components/property/locality-tile";
import { PropertyGrid } from "@/components/property/property-grid";
import { SearchBar } from "@/components/property/search-bar";
import {
  ChatIcon,
  KeyIcon,
  PinIcon,
  SearchIcon,
  TYPE_ICONS,
} from "@/components/ui/icons";
import { HomeSkeleton } from "@/components/ui/page-skeletons";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";
import {
  getLocalities,
  getLocalityTiles,
} from "@/server/queries/localities";
import {
  getFeaturedProperties,
  getPropertyCountsByType,
} from "@/server/queries/properties";

export const dynamic = "force-dynamic";

const TYPE_BLURBS: Record<string, string> = {
  pg: "Shared and single rooms with food — for students & working professionals",
  rent: "Independent flats and houses — for families & couples",
  homestay: "Short stays with local hosts — for visitors & pilgrims",
};

const STEPS = [
  {
    icon: SearchIcon,
    title: "Browse your area",
    body: "Filter by locality and price. Every listing is one we have seen ourselves.",
  },
  {
    icon: ChatIcon,
    title: "Tell us what you need",
    body: "Message us on WhatsApp or request a callback — no signup, no brokerage games.",
  },
  {
    icon: KeyIcon,
    title: "Visit and move in",
    body: "We share the exact address, arrange the visit and connect you to the owner.",
  },
];

export default function HomePage() {
  // Suspense here (rather than a loading.tsx) keeps navigation instant without
  // affecting the HTTP status of sibling routes that can 404.
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [featured, localities, localityTiles, counts] = await Promise.all([
    getFeaturedProperties(6),
    getLocalities(),
    getLocalityTiles(6),
    getPropertyCountsByType(),
  ]);

  const totalListings = counts.pg + counts.rent + counts.homestay;
  const collage = featured.filter((property) => property.images[0]).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-56 right-0 h-[28rem] w-[28rem] rounded-full bg-brand-400/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1360px] gap-12 px-6 pb-12 pt-12 sm:px-10 sm:pb-16 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-16 lg:pb-20 lg:pt-20">
          <div className="animate-fade-up text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-brand-200 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-400" />
              </span>
              {siteConfig.city} only · every listing verified by us
            </span>

            <h1 className="mt-5 text-[2.5rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Find your next
              <br />
              space in{" "}
              <span className="bg-gradient-to-r from-brand-200 via-brand-400 to-brand-300 bg-clip-text text-transparent">
                {siteConfig.city}
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-zinc-300 sm:text-lg lg:mx-0">
              PGs, rental flats and homestays with honest prices and real
              photos. Tell us your area — we handle the rest.
            </p>

            <div className="mt-7">
              <SearchBar localities={localities} />
            </div>

            {totalListings > 0 && (
              <dl className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start">
                {[
                  ...PROPERTY_TYPES.map((type) => ({
                    label: PROPERTY_TYPE_CONFIG[type].plural,
                    value: counts[type],
                  })),
                  { label: "Localities", value: localityTiles.length },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-1.5">
                    <dd className="text-xl font-bold text-white">
                      {stat.value}
                    </dd>
                    <dt className="text-sm text-zinc-400">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Photo collage — desktop only, keeps the mobile fold tight */}
          {collage.length === 3 && (
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl ring-1 ring-white/10">
                  <Image
                    src={collage[0].images[0].url}
                    alt=""
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4 pt-10">
                  <div className="relative aspect-square overflow-hidden rounded-3xl ring-1 ring-white/10">
                    <Image
                      src={collage[1].images[0].url}
                      alt=""
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/10">
                    <Image
                      src={collage[2].images[0].url}
                      alt=""
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/90 px-4 py-3 shadow-2xl backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                  <PinIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {totalListings} live listings
                  </p>
                  <p className="text-xs text-zinc-400">
                    across {localityTiles.length} localities
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Type cards */}
      <section className="mx-auto max-w-[1360px] px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
          {PROPERTY_TYPES.map((type) => {
            const Icon = TYPE_ICONS[type];
            return (
              <Link
                key={type}
                href={`/${PROPERTY_TYPE_CONFIG[type].categorySlug}`}
                className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-950/5 sm:p-6"
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-50 opacity-0 transition duration-300 group-hover:opacity-100"
                />
                <div className="relative flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/20">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">
                      {PROPERTY_TYPE_CONFIG[type].plural}
                    </h2>
                    <p className="text-xs font-medium text-brand-700">
                      {counts[type]} available now
                    </p>
                  </div>
                </div>
                <p className="relative mt-4 text-sm leading-relaxed text-zinc-600">
                  {TYPE_BLURBS[type]}
                </p>
                <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900">
                  Browse
                  <span className="transition duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Locality tiles */}
      {localityTiles.length > 0 && (
        <section className="mx-auto max-w-[1360px] px-6 pb-12 sm:px-10 sm:pb-16 lg:px-16">
          <SectionHeading
            eyebrow="Neighbourhoods"
            title="Browse by locality"
            subtitle={`Where people are moving in ${siteConfig.city} right now`}
          />
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
            {localityTiles.map((locality) => (
              <LocalityTile key={locality.id} locality={locality} />
            ))}
          </div>
        </section>
      )}

      {/* Latest listings */}
      <section className="mx-auto max-w-[1360px] px-6 pb-14 sm:px-10 sm:pb-20 lg:px-16">
        <SectionHeading
          eyebrow="Fresh on FindMySpace"
          title="Latest listings"
          subtitle={`Newly added across ${siteConfig.city}`}
          action={{ label: "View all", href: "/listings" }}
        />
        <PropertyGrid properties={featured} />
      </section>

      {/* How it works */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto max-w-[1360px] px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
              How it works
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              The middleman you actually want
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
              We filter out the noise so you only see places worth visiting —
              and we never show your number to a dozen brokers.
            </p>
            <Link
              href="/why"
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
            >
              How we verify every listing
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-3 sm:gap-6">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative rounded-3xl border border-zinc-200/80 bg-zinc-50/60 p-6"
              >
                <span className="absolute right-5 top-4 text-4xl font-bold text-zinc-200/90">
                  {index + 1}
                </span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                  <step.icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-4 font-bold text-zinc-900">
                  {step.title}
                </h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-zinc-600">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-[1360px] px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 px-6 py-10 text-center sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />
          <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Can&apos;t find the right place?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-50 sm:text-base">
            Tell us your area, budget and move-in date. We will check what is
            available and come back to you — usually the same day.
          </p>
          <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {siteConfig.whatsappNumber && (
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
              >
                Message us on WhatsApp
              </a>
            )}
            <Link
              href="/pg-in-guwahati"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse all listings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
