import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-6 px-6 py-10 sm:px-10 sm:flex-row sm:items-center sm:justify-between lg:px-16">
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
          <Link
            href="/why"
            className="inline-flex min-h-11 items-center px-2 hover:text-brand-700"
          >
            Why {siteConfig.name}
          </Link>
          <Link
            href="/host"
            className="inline-flex min-h-11 items-center px-2 font-semibold text-brand-700 hover:underline"
          >
            List your property
          </Link>
        </nav>
      </div>
      <div className="border-t border-zinc-100 py-4">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-2 px-6 text-xs text-zinc-400 sm:px-10 sm:flex-row sm:justify-between lg:px-16">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}, {siteConfig.city}
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-zinc-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-600">
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
