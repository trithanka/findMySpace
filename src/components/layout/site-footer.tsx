import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="inline-block">
            <Image
              src="/logo-full.png"
              alt={siteConfig.name}
              width={1200}
              height={803}
              className="h-16 w-auto"
            />
          </Link>
          <p className="mt-3 max-w-sm text-sm text-zinc-500">
            {siteConfig.tagline}. We connect you directly with owners.
          </p>
        </div>
        <nav className="-mx-2 flex flex-wrap text-sm text-zinc-600">
          {PROPERTY_TYPES.map((type) => (
            <Link
              key={type}
              href={`/${PROPERTY_TYPE_CONFIG[type].categorySlug}`}
              className="inline-flex min-h-11 items-center px-2 hover:text-brand-700"
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
