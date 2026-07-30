import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="-mr-2 inline-flex min-h-11 shrink-0 items-center gap-1 px-2 text-sm font-semibold text-brand-700 hover:underline"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
