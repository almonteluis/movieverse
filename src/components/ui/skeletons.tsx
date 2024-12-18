import { Skeleton } from "./skeleton";

export function HeroSkeleton() {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-muted">
      <div className="absolute inset-0">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      <div className="relative z-10 flex h-full items-end">
        <div className="container pb-16">
          <Skeleton className="mb-4 h-12 w-2/3" />
          <Skeleton className="mb-6 h-20 w-1/2" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Skeleton className="h-[300px] w-full" />
      <div className="p-4">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function ComingSoonCardSkeleton() {
  return (
    <div className="flex overflow-hidden rounded-lg border bg-card">
      <Skeleton className="h-[200px] w-[133px]" />
      <div className="flex-1 p-4">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-4 h-16 w-full" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
