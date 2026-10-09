import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function NewsCardSkeleton() {
  return (
    <Card className="h-full gap-4 overflow-hidden pt-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardContent className="flex flex-col gap-3 px-5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="px-5">
        <Skeleton className="h-4 w-40" />
      </CardFooter>
    </Card>
  );
}

interface NewsGridSkeletonProps {
  count?: number;
}

export function NewsGridSkeleton({ count = 6 }: NewsGridSkeletonProps) {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
}
