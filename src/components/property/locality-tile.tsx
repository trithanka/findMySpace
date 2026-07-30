import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { LocalityTile as LocalityTileData } from "@/server/queries/localities";

export function LocalityTile({ locality }: { locality: LocalityTileData }) {
  return (
    <Link
      href={`/guwahati/${locality.slug}`}
      className="group relative aspect-[4/5] w-44 shrink-0 snap-start overflow-hidden rounded-2xl bg-zinc-800 sm:w-auto"
    >
      {locality.image && (
        <Image
          src={locality.image}
          alt=""
          fill
          sizes="(max-width: 640px) 45vw, 25vw"
          className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <p className="font-semibold leading-tight text-white">
          {locality.name}
        </p>
        <p className="mt-1 text-xs text-white/75">
          {locality.count} listing{locality.count === 1 ? "" : "s"}
        </p>
        <p className="text-xs font-medium text-brand-300">
          from {formatPrice(locality.fromPrice, locality.fromPriceUnit)}
        </p>
      </div>
    </Link>
  );
}
