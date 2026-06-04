import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <Card className="mb-8">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Skeleton className="h-20 w-20 rounded-full" />

            <div>
              <Skeleton className="h-9 w-48" />
              <Skeleton className="mt-2 h-5 w-32" />
              <Skeleton className="mt-4 h-5 w-96 max-w-full" />
              <Skeleton className="mt-4 h-4 w-80 max-w-full" />
            </div>
          </div>

          <Skeleton className="h-10 w-28" />
        </CardContent>
      </Card>

      <Skeleton className="mb-6 h-8 w-48" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <Skeleton className="aspect-video w-full rounded-t-xl" />
            <CardContent className="p-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="mt-3 h-4 w-3/4" />
              <Skeleton className="mt-6 h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}