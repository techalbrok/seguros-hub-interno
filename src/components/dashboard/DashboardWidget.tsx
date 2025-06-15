
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { DashboardWidgetSkeleton } from './DashboardWidgetSkeleton';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps {
  title: string;
  icon: LucideIcon;
  viewAllHref: string;
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  icon: Icon,
  viewAllHref,
  isLoading,
  children,
  className,
  style
}) => {
  if (isLoading) {
    return <DashboardWidgetSkeleton />;
  }
  
  return (
    <Card className={cn(className)} style={style}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-muted-foreground" />
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={viewAllHref} className="text-sm font-medium text-primary hover:text-primary/90">
            Ver todo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
