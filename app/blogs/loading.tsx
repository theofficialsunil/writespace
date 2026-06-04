import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogsLoading() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-3 h-5 w-80" />
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <Skeleton className="aspect-video w-full rounded-t-xl" />
            <CardHeader>
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-7 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-6 h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}