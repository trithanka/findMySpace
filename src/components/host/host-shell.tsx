"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@/components/layout/account-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/host/listings", label: "My listings" },
  { href: "/host/account", label: "Account" },
];

/**
 * Chrome for the owner area, so "my listings" and "account" read as one place
 * rather than two unrelated pages. The wizard keeps its own stepped shell.
 */
export function HostShell({
  user,
  children,
}: {
  user: { name: string; email: string; image?: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            image={user.image}
            name={user.name}
            email={user.email}
            className="h-11 w-11 shrink-0 text-sm"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-zinc-900">
              {user.name || "Your account"}
            </p>
            <p className="truncate text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="flex gap-1">
            {TABS.map((tab) => {
              const active =
                tab.href === "/host/listings"
                  ? pathname === tab.href
                  : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={async () => {
              await authClient.signOut();
              router.push("/");
              router.refresh();
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="pt-8">{children}</div>
    </div>
  );
}
