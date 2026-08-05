"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/** First letters of the name, or of the email when there is no name. */
export function initialsFor(name?: string | null, email?: string | null) {
  const source = (name ?? "").trim() || (email ?? "").split("@")[0] || "?";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function Avatar({
  image,
  name,
  email,
  className,
}: {
  image?: string | null;
  name?: string | null;
  email?: string | null;
  className?: string;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        className={cn("rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center rounded-full bg-brand-600 font-semibold text-white",
        className,
      )}
    >
      {initialsFor(name, email)}
    </span>
  );
}

/**
 * The header's account area — the thing that tells you whether you are signed
 * in at all.
 *
 * Session state is read on the client rather than in the root layout on
 * purpose: reading it server-side would force every page, including the static
 * legal pages, to render dynamically. The cost is a brief moment before the
 * session resolves, during which we show the signed-out call to action, since
 * that is what most visitors are.
 */
export function AccountMenu() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (isPending || !session) {
    return (
      <Link
        href="/host"
        className="hidden rounded-full border border-brand-200 px-3 py-1.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 sm:inline-flex"
      >
        List your property
      </Link>
    );
  }

  const { user } = session;

  async function signOut() {
    setOpen(false);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={wrapper} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-zinc-200 py-1 pl-1 pr-3 transition hover:border-zinc-300 hover:bg-zinc-50"
      >
        <Avatar
          image={user.image}
          name={user.name}
          email={user.email}
          className="h-7 w-7 text-xs"
        />
        <span className="max-w-[9rem] truncate text-sm font-medium text-zinc-700">
          {user.name || user.email}
        </span>
        <svg
          viewBox="0 0 20 20"
          className={cn(
            "h-3.5 w-3.5 text-zinc-400 transition-transform",
            open && "rotate-180",
          )}
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.2 7.5 10 12.2l4.8-4.7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
        >
          <div className="border-b border-zinc-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-zinc-900">
              {user.name || "Your account"}
            </p>
            <p className="truncate text-xs text-zinc-500">{user.email}</p>
          </div>
          <nav className="p-1.5">
            <Link
              href="/host/listings"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              My listings
            </Link>
            <Link
              href="/host/listings/new"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Add a listing
            </Link>
            <Link
              href="/host/account"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Account settings
            </Link>
          </nav>
          <div className="border-t border-zinc-100 p-1.5">
            <button
              type="button"
              onClick={signOut}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
