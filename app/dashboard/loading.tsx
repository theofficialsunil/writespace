import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-3 h-5 w-80" />
        </div>

        <Skeleton className="h-10 w-36" />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="flex items-center gap-4 p-6">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-7 w-12" />
                <Skeleton className="mt-2 h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-3 h-7 w-2/3" />
              <Skeleton className="mt-2 h-4 w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}