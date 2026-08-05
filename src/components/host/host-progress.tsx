import Link from "next/link";
import {
  HOST_STEPS,
  hostStepHref,
  hostStepIndex,
  type HostStepSlug,
} from "@/lib/host-steps";
import { cn } from "@/lib/utils";

/**
 * Wizard progress. Completed steps link back so a host can correct an earlier
 * answer; steps ahead stay inert, because the draft has not been through the
 * validation they depend on yet.
 */
export function HostProgress({
  current,
  listingId,
}: {
  current: HostStepSlug;
  listingId: number;
}) {
  const currentIndex = hostStepIndex(current);

  return (
    <ol className="flex items-center gap-1.5">
      {HOST_STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;

        const content = (
          <span
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition",
              active && "bg-brand-600 text-white",
              done && "bg-brand-50 text-brand-700 hover:bg-brand-100",
              !active && !done && "text-zinc-400",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                active && "bg-white/25",
                done && "bg-brand-600 text-white",
                !active && !done && "bg-zinc-100 text-zinc-500",
              )}
            >
              {done ? "✓" : index + 1}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </span>
        );

        return (
          <li key={step.slug} className="flex items-center gap-1.5">
            {done ? (
              <Link href={hostStepHref(listingId, step.slug)}>{content}</Link>
            ) : (
              content
            )}
            {index < HOST_STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px w-3 sm:w-6",
                  index < currentIndex ? "bg-brand-300" : "bg-zinc-200",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
