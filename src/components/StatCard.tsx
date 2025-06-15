
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  loading
}) => {
  if (loading) {
    return (
      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 shimmer" />
          </div>
          <Skeleton className="h-5 w-5 rounded-md shimmer" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2 shimmer" />
          <Skeleton className="h-3 w-full shimmer" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="stat-card interactive-element group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
          <Icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">
            {description}
          </p>
        )}
      </CardContent>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
    </Card>
  );
};
