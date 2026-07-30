import Link from "next/link";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";
import { formatPrice, propertyCode } from "@/lib/utils";
import { requireAdmin } from "@/server/auth-guard";
import {
  getAdminStats,
  listEnquiries,
  listRecentProperties,
} from "@/server/queries/admin";

function StatCard({
  label,
  value,
  hint,
  tone = "default",
  href,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "default" | "accent" | "warning";
  href?: string;
}) {
  const tones = {
    default: "border-zinc-200 bg-white",
    accent: "border-brand-200 bg-brand-50/60",
    warning: "border-amber-200 bg-amber-50/60",
  };

  const content = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </>
  );

  const className = `rounded-2xl border p-4 ${tones[tone]}`;

  return href ? (
    <Link href={href} className={`${className} block transition hover:shadow-md`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

function relativeDate(date: Date) {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default async function AdminOverviewPage() {
  const session = await requireAdmin();
  const [stats, recentEnquiries, recentProperties] = await Promise.all([
    getAdminStats(),
    listEnquiries(5),
    listRecentProperties(5),
  ]);

  const liveTotal = stats.status.available;
  const typeMax = Math.max(...PROPERTY_TYPES.map((type) => stats.type[type]), 1);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Overview
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Signed in as {session.user.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Live listings"
          value={liveTotal}
          hint={`${stats.totalProperties} total`}
          tone="accent"
          href="/admin/properties"
        />
        <StatCard
          label="Occupied"
          value={stats.status.occupied}
          hint="Hidden from search"
        />
        <StatCard
          label="Hidden"
          value={stats.status.hidden}
          hint="Drafts & paused"
        />
        <StatCard
          label="Enquiries"
          value={stats.enquiries.total}
          hint={`${stats.enquiries.lastWeek} in the last 7 days`}
          href="/admin/enquiries"
        />
      </div>

      {stats.missingPhotos > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">
              {stats.missingPhotos} propert
              {stats.missingPhotos === 1 ? "y has" : "ies have"} no photos
            </span>{" "}
            — listings with photos get far more enquiries.
          </p>
          <Link
            href="/admin/properties"
            className="inline-flex min-h-9 items-center rounded-lg px-2 text-sm font-semibold text-amber-900 underline underline-offset-2 hover:bg-amber-100"
          >
            Fix now
          </Link>
        </div>
      )}

      {/* Mix by type */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold text-zinc-900">Live listings by type</h2>
        <dl className="mt-4 space-y-3">
          {PROPERTY_TYPES.map((type) => (
            <div key={type} className="flex items-center gap-3">
              <dt className="w-24 shrink-0 text-sm text-zinc-600">
                {PROPERTY_TYPE_CONFIG[type].plural}
              </dt>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{
                    width: `${(stats.type[type] / typeMax) * 100}%`,
                  }}
                />
              </div>
              <dd className="w-8 shrink-0 text-right text-sm font-semibold text-zinc-900">
                {stats.type[type]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent enquiries */}
        <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <h2 className="font-semibold text-zinc-900">Recent enquiries</h2>
            <Link
              href="/admin/enquiries"
              className="-mr-2 inline-flex min-h-9 items-center rounded-lg px-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
            >
              View all
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-zinc-400">
              No enquiries yet.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {recentEnquiries.map((enquiry) => (
                <li
                  key={enquiry.id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900">
                      {enquiry.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {propertyCode(enquiry.property.id)} ·{" "}
                      {enquiry.property.locality.name}
                      {enquiry.moveInDate ? ` · Stay from ${enquiry.moveInDate}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <a
                      href={`tel:${enquiry.phone}`}
                      className="-mr-2 inline-flex min-h-9 items-center whitespace-nowrap rounded-lg px-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
                    >
                      {enquiry.phone}
                    </a>
                    <p className="text-xs text-zinc-400">
                      {relativeDate(enquiry.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recently added */}
        <section className="min-w-0 rounded-2xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <h2 className="font-semibold text-zinc-900">Recently added</h2>
            <Link
              href="/admin/properties"
              className="-mr-2 inline-flex min-h-9 items-center rounded-lg px-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
            >
              View all
            </Link>
          </div>
          {recentProperties.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-zinc-400">No properties yet.</p>
              <Link
                href="/admin/properties/new"
                className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                Add your first listing →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {recentProperties.map((property) => (
                <li key={property.id}>
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-zinc-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-900">
                        {property.title}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {propertyCode(property.id)} · {property.locality.name}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-zinc-900">
                        {formatPrice(property.price, property.priceUnit)}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {relativeDate(property.createdAt)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
