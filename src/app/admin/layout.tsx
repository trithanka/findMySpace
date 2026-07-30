import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { getAdminSession } from "@/server/auth-guard";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // The login page lives under this layout — show it without the admin shell.
  if (!session) return <>{children}</>;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="hidden rounded-lg bg-zinc-900 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white sm:inline">
            Admin
          </span>
          <AdminNav />
        </div>
        <div className="flex items-center gap-3 border-t border-zinc-100 pt-3 sm:border-0 sm:pt-0">
          <Link
            href="/admin/properties/new"
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-brand-600 px-3 text-sm font-semibold text-white transition hover:bg-brand-700 sm:flex-none"
          >
            + New property
          </Link>
          <SignOutButton />
        </div>
      </div>
      <div className="pt-7">{children}</div>
    </div>
  );
}
