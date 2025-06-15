
import { Card, CardContent } from "@/components/ui/card";

interface DelegationsLoadingProps {
    t: { plural: string };
}

export const DelegationsLoading = ({ t }: DelegationsLoadingProps) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white">
        Gestión de {t.plural}
      </h1>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
