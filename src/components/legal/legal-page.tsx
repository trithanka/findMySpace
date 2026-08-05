import { legalConfig } from "@/config/site";

/** Shared shell so both legal documents read as one set. */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-lg text-zinc-600">{intro}</p>
      <p className="mt-2 text-sm text-zinc-400">
        Last updated {legalConfig.lastUpdated}
      </p>
      <div className="mt-10 space-y-9">{children}</div>
    </div>
  );
}

export function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-bold text-zinc-900">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600 [&_a]:font-medium [&_a]:text-brand-700 [&_a:hover]:underline [&_strong]:font-semibold [&_strong]:text-zinc-800">
        {children}
      </div>
    </section>
  );
}

/** Bulleted list with the spacing both documents use. */
export function List({ children }: { children: React.ReactNode }) {
  return (
    <ul className="ml-5 list-disc space-y-1.5 marker:text-zinc-300">
      {children}
    </ul>
  );
}
