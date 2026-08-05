import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApproximateMap } from "@/components/property/approximate-map";
import { EnquiryForm } from "@/components/property/enquiry-form";
import { PropertyGallery } from "@/components/property/property-gallery";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import {
  FURNISHING_LABELS,
  GENDER_PREFERENCE_LABELS,
  PROPERTY_TYPE_CONFIG,
} from "@/lib/constants";
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
//
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3">
      <dt className="text-xs uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-zinc-800">{value}</dd>
    </div>
  );
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

  // Blurred here, on the server: the exact pin is private and must not be
  // serialised into the page the browser receives.
  const approximate =
    property.latitude !== null && property.longitude !== null
      ? approximateLocation(property.latitude, property.longitude, property.id)
      : null;

  const facts: [string, string][] = [
    ["Type", PROPERTY_TYPE_CONFIG[property.type].label],
    ["Locality", property.locality.name],
  ];
  if (property.bedrooms) facts.push(["Bedrooms", String(property.bedrooms)]);
  if (property.furnishing)
    facts.push(["Furnishing", FURNISHING_LABELS[property.furnishing]]);
  if (property.type === "pg" && property.genderPreference)
    facts.push([
      "For",
      GENDER_PREFERENCE_LABELS[property.genderPreference],
    ]);
  if (property.deposit)
    facts.push(["Deposit", formatPrice(property.deposit, property.priceUnit).split("/")[0]]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Gallery */}
      <PropertyGallery
        images={property.images}
        title={property.title}
        instagramShortcode={property.instagramShortcode}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        {/* Main info */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">
              {PROPERTY_TYPE_CONFIG[property.type].label}
            </Badge>
            <Badge variant="outline">{code}</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
            {property.title}
          </h1>
          <p className="mt-1 text-zinc-500">
            {property.locality.name}, {siteConfig.city}
            {property.landmark ? ` · ${property.landmark}` : ""}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {facts.map(([label, value]) => (
              <Fact key={label} label={label} value={value} />
            ))}
          </dl>

          {property.amenities.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-zinc-900">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} variant="default">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-900">
              About this place
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-zinc-600">
              {property.description}
            </p>
          </section>

          {approximate && (
            <ApproximateMap
              center={approximate}
              localityName={property.locality.name}
            />
          )}

          <p className="mt-8 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-500">
            Exact address is shared after you enquire — we verify every visit
            and connect you directly with the owner.
          </p>
        </div>

        {/* Enquiry panel */}
        <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <p className="text-2xl font-bold text-brand-700">
            {formatPrice(property.price, property.priceUnit)}
          </p>
          {siteConfig.whatsappNumber && (
            <a
              href={whatsappEnquiryUrl(
                siteConfig.whatsappNumber,
                code,
                property.title,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Enquire on WhatsApp
            </a>
          )}
          <div className="my-5 flex items-center gap-3 text-xs text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200" />
            or request a callback
            <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <EnquiryForm propertyId={property.id} />
        </aside>
      </div>
    </div>
  );
}
