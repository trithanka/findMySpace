import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApproximateMap } from "@/components/property/approximate-map";
import { EnquiryForm } from "@/components/property/enquiry-form";
import { MobileEnquiryDrawer } from "@/components/property/mobile-enquiry-drawer";
import { PropertyActions } from "@/components/property/property-actions";
import { PropertyGallery } from "@/components/property/property-gallery";
import { Badge } from "@/components/ui/badge";
import {
  BedIcon,
  CheckVerifiedIcon,
  getAmenityIcon,
  HomeIcon,
  PinIcon,
  ShieldCheckIcon,
  SuitcaseIcon,
  UserIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import {
  FURNISHING_LABELS,
  GENDER_PREFERENCE_LABELS,
  PROPERTY_TYPE_CONFIG,
} from "@/lib/constants";
import { disclosureFor } from "@/lib/disclosure";
import { formatPrice, propertyCode, whatsappEnquiryUrl } from "@/lib/utils";
import { approximateLocation } from "@/server/approximate-location";
import { getPropertyBySlug } from "@/server/queries/properties";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  return {
    title: `${property.title} — ${property.locality.name}`,
    description: `${PROPERTY_TYPE_CONFIG[property.type].label} in ${property.locality.name}, ${siteConfig.city} at ${formatPrice(property.price, property.priceUnit)}. ${property.description.slice(0, 140)}`,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const code = propertyCode(property.id);
  const disclosure = disclosureFor(property.type);
  const hasPin = property.latitude !== null && property.longitude !== null;
  const mapCenter = !hasPin
    ? null
    : disclosure.exactLocation
      ? { lat: property.latitude!, lng: property.longitude! }
      : approximateLocation(property.latitude!, property.longitude!, property.id);

  // Icon mapping for property types
  const TypeIcon =
    property.type === "pg"
      ? BedIcon
      : property.type === "rent"
        ? HomeIcon
        : SuitcaseIcon;

  return (
    <div className="mx-auto max-w-[1360px] px-6 py-6 pb-28 sm:px-10 lg:px-16 lg:pb-12">
      {/* ---------- BREADCRUMB & TOP ACTIONS ---------- */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <nav className="flex items-center gap-1.5 text-zinc-500 overflow-x-auto scrollbar-none py-1">
          <Link href="/" className="transition hover:text-zinc-900">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/guwahati/${property.locality.slug}`}
            className="transition hover:text-zinc-900 line-clamp-1"
          >
            {property.locality.name}
          </Link>
          <span>/</span>
          <span className="font-medium text-zinc-900 line-clamp-1 max-w-[180px] sm:max-w-xs">
            {property.title}
          </span>
        </nav>

        {/* Share & Wishlist Toolbar */}
        <PropertyActions
          propertyId={property.id}
          title={property.title}
          localityName={property.locality.name}
        />
      </div>

      {/* ---------- PROPERTY TITLE & QUICK BADGES HEADER ---------- */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent" className="flex items-center gap-1">
            <TypeIcon className="h-3.5 w-3.5" />
            {PROPERTY_TYPE_CONFIG[property.type].label}
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            ID: {code}
          </Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckVerifiedIcon className="h-3.5 w-3.5" />
            Verified Listing
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl">
          {property.title}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
          <PinIcon className="h-4 w-4 text-brand-600 shrink-0" />
          <span>
            {property.locality.name}, {siteConfig.city}
            {property.landmark ? ` · Near ${property.landmark}` : ""}
          </span>
        </div>
      </div>

      {/* ---------- PHOTO GALLERY & INSTAGRAM REEL ---------- */}
      <PropertyGallery
        images={property.images}
        title={property.title}
        instagramShortcode={property.instagramShortcode}
      />

      {/* ---------- MAIN CONTENT GRID ---------- */}
      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        {/* Left 2 Columns: Information & Features */}
        <div className="space-y-10 lg:col-span-2">
          {/* Key Facts Highlights Grid */}
          <section className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Key Highlights
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-3.5 border border-zinc-200/70 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-400">
                  <TypeIcon className="h-4 w-4 text-brand-600" />
                  Property Type
                </div>
                <div className="mt-1.5 text-sm font-bold text-zinc-900">
                  {PROPERTY_TYPE_CONFIG[property.type].label}
                </div>
              </div>

              {property.bedrooms !== null && property.bedrooms !== undefined && (
                <div className="rounded-xl bg-white p-3.5 border border-zinc-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-400">
                    <BedIcon className="h-4 w-4 text-brand-600" />
                    Bedrooms
                  </div>
                  <div className="mt-1.5 text-sm font-bold text-zinc-900">
                    {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                  </div>
                </div>
              )}

              {property.furnishing && (
                <div className="rounded-xl bg-white p-3.5 border border-zinc-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-400">
                    <HomeIcon className="h-4 w-4 text-brand-600" />
                    Furnishing
                  </div>
                  <div className="mt-1.5 text-sm font-bold text-zinc-900">
                    {FURNISHING_LABELS[property.furnishing]}
                  </div>
                </div>
              )}

              {property.type === "pg" && property.genderPreference && (
                <div className="rounded-xl bg-white p-3.5 border border-zinc-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-400">
                    <UserIcon className="h-4 w-4 text-brand-600" />
                    Preferred Tenant
                  </div>
                  <div className="mt-1.5 text-sm font-bold text-zinc-900">
                    {GENDER_PREFERENCE_LABELS[property.genderPreference]}
                  </div>
                </div>
              )}

              {property.deposit && (
                <div className="rounded-xl bg-white p-3.5 border border-zinc-200/70 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-400">
                    <ShieldCheckIcon className="h-4 w-4 text-brand-600" />
                    Security Deposit
                  </div>
                  <div className="mt-1.5 text-sm font-bold text-zinc-900">
                    {formatPrice(property.deposit, property.priceUnit).split("/")[0]}
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-white p-3.5 border border-zinc-200/70 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-400">
                  <PinIcon className="h-4 w-4 text-brand-600" />
                  Locality
                </div>
                <div className="mt-1.5 text-sm font-bold text-zinc-900 line-clamp-1">
                  {property.locality.name}
                </div>
              </div>
            </div>
          </section>

          {/* Verification Guarantee Banner */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-950">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <CheckVerifiedIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Physically Verified Property</h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Our local Guwahati team has personally visited and verified this space for accurate photos, amenities, and host authenticity.
              </p>
            </div>
          </div>

          {/* Amenities Section */}
          {property.amenities.length > 0 && (
            <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
              <h2 className="text-lg font-bold text-zinc-900">
                What this place offers
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((amenity) => {
                  const AmenityIcon = getAmenityIcon(amenity);
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3.5 py-3 border border-zinc-200/60 text-zinc-800 transition hover:bg-zinc-100/80"
                    >
                      <AmenityIcon className="h-5 w-5 text-brand-600 shrink-0" />
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* About Space / Description Section */}
          <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            <h2 className="text-lg font-bold text-zinc-900">
              About this space
            </h2>
            <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-600 sm:text-base">
              {property.description}
            </div>
          </section>

          {/* Hosted By Info Card */}
          {disclosure.ownerName && property.ownerName && (
            <div className="flex items-center gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white shadow-xs">
                {property.ownerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Verified Host
                </span>
                <h3 className="text-base font-bold text-zinc-900">
                  Hosted by {property.ownerName}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Direct connection with host after callback enquiry.
                </p>
              </div>
            </div>
          )}

          {/* Location Map Section */}
          {mapCenter && (
            <ApproximateMap
              center={mapCenter}
              localityName={property.locality.name}
              precise={disclosure.exactLocation}
              addressLine={
                disclosure.exactLocation ? property.addressLine : null
              }
            />
          )}

          {/* Privacy Note */}
          <p className="rounded-xl bg-zinc-100/70 p-4 text-xs leading-relaxed text-zinc-500 border border-zinc-200/60">
            {disclosure.exactLocation
              ? "We verify every homestay before listing. Request a callback and we will introduce you directly to the host."
              : "Exact street address is shared after you enquire — we verify every visit and connect you directly with the property owner."}
          </p>
        </div>

        {/* Right 1 Column: Sticky Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-md">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold tracking-tight text-zinc-900">
                  {formatPrice(property.price, property.priceUnit).split("/")[0]}
                </span>
                <span className="text-sm font-medium text-zinc-500">
                  /{property.priceUnit}
                </span>
              </div>
              {property.deposit && (
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                  Deposit: {formatPrice(property.deposit, property.priceUnit).split("/")[0]}
                </span>
              )}
            </div>

            {/* Direct WhatsApp Action Button */}
            {siteConfig.whatsappNumber && (
              <a
                href={whatsappEnquiryUrl(
                  siteConfig.whatsappNumber,
                  code,
                  property.title,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Enquire on WhatsApp
              </a>
            )}

            <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
              <span className="h-px flex-1 bg-zinc-200" />
              or request callback
              <span className="h-px flex-1 bg-zinc-200" />
            </div>

            {/* Callback Request Form */}
            <EnquiryForm propertyId={property.id} />

            <div className="mt-6 flex items-center justify-center gap-4 border-t border-zinc-100 pt-4 text-xs font-medium text-zinc-400">
              <span className="flex items-center gap-1">
                <CheckVerifiedIcon className="h-3.5 w-3.5 text-emerald-600" />
                Zero Brokerage
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-brand-600" />
                Verified Host
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* ---------- MOBILE STICKY BOTTOM ACTION BAR (< 1024px) ---------- */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-zinc-200/90 bg-white/95 p-3 shadow-2xl backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold text-zinc-900">
              {formatPrice(property.price, property.priceUnit).split("/")[0]}
              <span className="text-xs font-normal text-zinc-500">
                /{property.priceUnit}
              </span>
            </div>
            <div className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
              <CheckVerifiedIcon className="h-3 w-3" /> Zero Brokerage
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {siteConfig.whatsappNumber && (
              <a
                href={whatsappEnquiryUrl(
                  siteConfig.whatsappNumber,
                  code,
                  property.title,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 active:scale-95 shadow-xs"
                aria-label="Enquire on WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            )}

            <MobileEnquiryDrawer
              propertyId={property.id}
              propertyTitle={property.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
