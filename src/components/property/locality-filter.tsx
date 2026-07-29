"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/form";
import type { Locality } from "@/server/queries/localities";

export function LocalityFilter({
  localities,
  categorySlug,
  currentLocalitySlug,
}: {
  localities: Locality[];
  categorySlug: string;
  currentLocalitySlug?: string;
}) {
  const router = useRouter();

  return (
    <Select
      aria-label="Filter by locality"
      className="w-auto min-w-48"
      value={currentLocalitySlug ?? ""}
      onChange={(event) => {
        const slug = event.target.value;
        router.push(slug ? `/${categorySlug}/${slug}` : `/${categorySlug}`);
      }}
    >
      <option value="">All localities</option>
      {localities.map((locality) => (
        <option key={locality.id} value={locality.slug}>
          {locality.name}
        </option>
      ))}
    </Select>
  );
}
