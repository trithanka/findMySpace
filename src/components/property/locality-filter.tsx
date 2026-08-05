"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/form";
import type { Locality } from "@/server/queries/localities";

/**
 * `basePath` is where "All localities" goes; a chosen locality is appended to
 * `localityBasePath`. They differ on the all-types listings page, where
 * clearing the filter returns to `/listings` but picking a locality hands over
 * to `/guwahati/<locality>`, the route that already lists every type in one
 * area.
 */
export function LocalityFilter({
  localities,
  basePath,
  localityBasePath = basePath,
  currentLocalitySlug,
}: {
  localities: Locality[];
  basePath: string;
  localityBasePath?: string;
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
        router.push(slug ? `${localityBasePath}/${slug}` : basePath);
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
