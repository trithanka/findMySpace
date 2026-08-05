import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List your property",
  // The host area is behind a login and personal to each host — nothing here
  // should ever land in search results.
  robots: { index: false, follow: false },
};

// Every page here reads the session, so none of it can be statically rendered.
export const dynamic = "force-dynamic";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-zinc-50/60">{children}</div>;
}
