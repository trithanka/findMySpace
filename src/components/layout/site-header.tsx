import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
            F
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {PROPERTY_TYPES.map((type) => (
            <Link
              key={type}
              href={`/${PROPERTY_TYPE_CONFIG[type].categorySlug}`}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              {PROPERTY_TYPE_CONFIG[type].plural}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
