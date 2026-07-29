import Link from "next/link";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { getAdminSession } from "@/server/auth-guard";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // The login page lives under this layout — show it without the admin nav.
  if (!session) return <>{children}</>;

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <nav className="flex items-center gap-4 text-sm font-medium">
          <span className="font-semibold text-zinc-900">Admin</span>
          <Link href="/admin" className="text-zinc-600 hover:text-emerald-700">
            Properties
          </Link>
          <Link
            href="/admin/enquiries"
            className="text-zinc-600 hover:text-emerald-700"
          >
            Enquiries
          </Link>
          <Link
            href="/admin/properties/new"
            className="text-zinc-600 hover:text-emerald-700"
          >
            + New property
          </Link>
        </nav>
        <SignOutButton />
      </div>
      <div className="py-8">{children}</div>
    </div>
  );
}
