import Image from "next/image";
import Link from "next/link";
import { AccountMenu } from "@/components/layout/account-menu";
import { SiteNav } from "@/components/layout/site-nav";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur-md">
      <div className="relative flex h-20 w-full items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          {/*
            The mark only — the full lockup stacks "FIND / MY / SPACE" over three
            lines, which is unreadable at header height, so the name is set as
            text beside it.
          */}
          <Image
            src="/logo-mark.png"
            alt=""
            width={387}
            height={600}
            priority
            className="h-10.5 w-auto"
          />
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-zinc-900">
              {siteConfig.name}
            </span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand">
              Property Management
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <SiteNav />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
