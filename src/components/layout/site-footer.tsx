import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-zinc-900">{siteConfig.name}</p>
          <p className="mt-1 text-sm text-zinc-500">
            {siteConfig.tagline}. We connect you directly with owners.
          </p>
        </div>
        <nav className="flex gap-4 text-sm text-zinc-600">
          {PROPERTY_TYPES.map((type) => (
            <Link
              key={type}
              href={`/${PROPERTY_TYPE_CONFIG[type].categorySlug}`}
              className="hover:text-emerald-700"
            >
              {PROPERTY_TYPE_CONFIG[type].plural}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} {siteConfig.name}, {siteConfig.city}
      </div>
    </footer>
  );
}
