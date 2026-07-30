"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SearchIcon } from "@/components/ui/icons";
import {
  PROPERTY_TYPE_CONFIG,
  PROPERTY_TYPES,
  type PropertyType,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Only what the dropdown needs, so both locality query shapes fit. */
export type LocalityOption = { id: number; name: string; slug: string };

export function SearchBar({ localities }: { localities: LocalityOption[] }) {
  const router = useRouter();
  const [type, setType] = useState<PropertyType>("pg");
  const [localitySlug, setLocalitySlug] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const base = `/${PROPERTY_TYPE_CONFIG[type].categorySlug}`;
    const href = localitySlug ? `${base}/${localitySlug}` : base;
    startTransition(() => router.push(href));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-xl shadow-brand-950/5 sm:p-4"
    >
      <div
        role="radiogroup"
        aria-label="Property type"
        className="grid grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1"
      >
        {PROPERTY_TYPES.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={type === option}
            onClick={() => setType(option)}
            className={cn(
              "rounded-lg px-2 py-2.5 text-sm font-semibold transition",
              type === option
                ? "bg-white text-brand-700 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800",
            )}
          >
            {PROPERTY_TYPE_CONFIG[option].plural}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Locality</span>
          <select
            value={localitySlug}
            onChange={(event) => setLocalitySlug(event.target.value)}
            className="h-12 w-full rounded-xl border border-zinc-300 bg-white px-3 text-base text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:text-sm"
          >
            <option value="">Anywhere in Guwahati</option>
            {localities.map((locality) => (
              <option key={locality.id} value={locality.slug}>
                {locality.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.99] disabled:opacity-80 sm:w-auto"
        >
          {pending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <SearchIcon className="h-4 w-4" />
          )}
          {pending ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
