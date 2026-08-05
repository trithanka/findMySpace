/** The host wizard, in order. Drives the progress bar and the next/back links. */
export const HOST_STEPS = [
  { slug: "location", label: "Place" },
  { slug: "basics", label: "Details" },
  { slug: "photos", label: "Photos" },
  { slug: "pricing", label: "Price" },
  { slug: "review", label: "Review" },
] as const;

export type HostStepSlug = (typeof HOST_STEPS)[number]["slug"];

export function hostStepIndex(slug: HostStepSlug): number {
  return HOST_STEPS.findIndex((step) => step.slug === slug);
}

export function hostStepHref(id: number, slug: HostStepSlug): string {
  return `/host/listings/${id}/${slug}`;
}

/** The step after `slug`, or null on the last one. */
export function nextHostStep(slug: HostStepSlug): HostStepSlug | null {
  return HOST_STEPS[hostStepIndex(slug) + 1]?.slug ?? null;
}

export const SUBMISSION_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "In review",
  approved: "Live",
  rejected: "Needs changes",
};
