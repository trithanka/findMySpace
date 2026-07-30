import { PropertyGridSkeleton, Skeleton } from "@/components/ui/skeleton";

/*
 * These live inside the pages (as <Suspense fallback>) rather than in
 * loading.tsx files. A loading.tsx above a segment that can call notFound()
 * makes Next flush a 200 before the 404 is decided, so removed listings and
 * junk URLs would answer "200 OK" with not-found content — a soft 404.
 */

export function HomeSkeleton() {
  return (
    <>
      <section className="bg-zinc-950">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-12 pt-12 sm:pb-16 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-20 lg:pt-20">
          <div className="space-y-5">
            <Skeleton className="mx-auto h-7 w-72 rounded-full bg-white/10 lg:mx-0" />
            <Skeleton className="mx-auto h-12 w-full max-w-md bg-white/10 lg:mx-0" />
            <Skeleton className="mx-auto h-5 w-4/5 max-w-sm bg-white/10 lg:mx-0" />
            <Skeleton className="h-36 w-full rounded-2xl bg-white/10" />
          </div>
          <div className="hidden gap-4 lg:grid lg:grid-cols-2">
            <Skeleton className="aspect-[3/4] rounded-3xl bg-white/10" />
            <div className="space-y-4 pt-10">
              <Skeleton className="aspect-square rounded-3xl bg-white/10" />
              <Skeleton className="aspect-[4/3] rounded-3xl bg-white/10" />
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-44 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="mb-5 mt-12 h-7 w-52" />
        <PropertyGridSkeleton />
      </div>
    </>
  );
}

export function ListingsSkeleton({ withFilter = false }: { withFilter?: boolean }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        {withFilter && <Skeleton className="h-12 w-48 rounded-xl" />}
      </div>
      <PropertyGridSkeleton />
    </div>
  );
}
