"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TYPE_ICONS } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Escape to close, and hold the page still while the sheet is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <nav className="hidden items-center gap-1 sm:flex">
        {PROPERTY_TYPES.map((type) => {
          const href = `/${PROPERTY_TYPE_CONFIG[type].categorySlug}`;
          return (
            <Link
              key={type}
              href={href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition",
                pathname.startsWith(href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              )}
            >
              {PROPERTY_TYPE_CONFIG[type].plural}
            </Link>
          );
        })}
        <Link
          href="/host"
          className="ml-1 rounded-full border border-brand-200 px-3 py-1.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
        >
          List your property
        </Link>
      </nav>

      {/* Mobile toggle — three bars that morph into an X */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl border border-zinc-200 text-zinc-800 transition active:scale-95 active:bg-zinc-100 sm:hidden"
      >
        <span
          className={cn(
            "h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ease-out",
            open && "translate-y-[7px] rotate-45",
          )}
        />
        <span
          className={cn(
            "h-0.5 w-5 rounded-full bg-current transition-opacity duration-150",
            open ? "opacity-0" : "opacity-100",
          )}
        />
        <span
          className={cn(
            "h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ease-out",
            open && "-translate-y-[7px] -rotate-45",
          )}
        />
      </button>

      {/*
        Backdrop. Anchored with `absolute` rather than `fixed`: the header sets
        backdrop-blur, which makes it the containing block for fixed children,
        so a fixed overlay would be measured against the 64px header instead of
        the viewport. Body scroll is locked while open, so one viewport of
        height covers everything visible.
      */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-full z-30 h-[100dvh] bg-zinc-950/40 transition-opacity duration-200 sm:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Sheet — stays mounted so it can animate both ways */}
      <div
        id="mobile-nav"
        className={cn(
          // Only opacity/transform are transitioned, and the whole sheet moves
          // as one piece — staggering the rows made it read as two separate
          // animations (panel first, contents after).
          "absolute inset-x-0 top-full z-40 origin-top overflow-hidden rounded-b-2xl border-b border-zinc-200 bg-white shadow-xl transition-[opacity,transform,visibility] duration-200 ease-out sm:hidden",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0",
        )}
      >
        <nav className="flex flex-col p-2">
          {PROPERTY_TYPES.map((type) => {
            const href = `/${PROPERTY_TYPE_CONFIG[type].categorySlug}`;
            const active = pathname.startsWith(href);
            const Icon = TYPE_ICONS[type];
            return (
              <Link
                key={type}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3.5 text-base font-medium transition-colors active:bg-zinc-100",
                  active ? "text-brand-700" : "text-zinc-800",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    active
                      ? "bg-brand-600 text-white"
                      : "bg-zinc-100 text-zinc-600",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {PROPERTY_TYPE_CONFIG[type].plural} in {siteConfig.city}
              </Link>
            );
          })}

          <Link
            href="/host"
            onClick={() => setOpen(false)}
            className="mt-1 flex min-h-12 items-center justify-center rounded-xl border border-brand-200 px-4 text-sm font-semibold text-brand-700"
          >
            List your property
          </Link>

          {siteConfig.whatsappNumber && (
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 flex min-h-12 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Talk to us on WhatsApp
            </a>
          )}
        </nav>
      </div>
    </>
  );
}
