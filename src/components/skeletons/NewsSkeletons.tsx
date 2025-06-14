
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const NewsCardSkeleton = () => {
    return (
        <Card className="flex flex-col md:flex-row md:items-start p-4 gap-4">
            <Skeleton className="h-48 w-full md:w-1/3 md:h-32 rounded-md" />
            <div className="flex flex-col justify-between flex-1">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex items-center justify-between mt-4">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>
            </div>
        </Card>
    );
};
