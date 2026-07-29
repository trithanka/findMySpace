export function cn(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(price: number, unit: "month" | "night"): string {
  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
  return `${amount}/${unit}`;
}

/** Public display code for a property, e.g. FMS-1024. Derived, not stored. */
export function propertyCode(id: number): string {
  return `FMS-${1000 + id}`;
}

export function whatsappEnquiryUrl(
  number: string,
  code: string,
  title: string,
): string {
  const text = encodeURIComponent(
    `Hi, I'm interested in ${code} — ${title}. Is it available?`,
  );
  return `https://wa.me/${number}?text=${text}`;
}
