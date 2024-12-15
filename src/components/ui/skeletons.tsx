import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function HeroSkeleton() {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <Skeleton className="absolute inset-0" />
      <div className="relative z-10 flex h-full items-end">
        <div className="container pb-16">
          <Skeleton className="mb-4 h-14 w-2/3" />
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
    <Card className="overflow-hidden">
      <Skeleton className="h-[300px] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </Card>
  );
}

export function ComingSoonCardSkeleton() {
  return (
    <Card className="flex overflow-hidden">
      <Skeleton className="h-[200px] w-[133px] shrink-0" />
      <div className="p-4 w-full space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-8 w-24" />
      </div>
    </Card>
  );
}

export function CategoryCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="absolute bottom-4 left-4">
        <Skeleton className="h-6 w-24" />
      </div>
    </Card>
  );
}
