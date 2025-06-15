
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  gradient?: 'default' | 'users' | 'companies' | 'products' | 'news' | 'delegations' | 'departments' | 'settings';
  className?: string;
}

const gradientVariants = {
  default: 'from-primary/10 via-accent/5 to-background',
  users: 'from-blue-500/10 via-blue-300/5 to-background',
  companies: 'from-green-500/10 via-green-300/5 to-background',
  products: 'from-purple-500/10 via-purple-300/5 to-background',
  news: 'from-orange-500/10 via-orange-300/5 to-background',
  delegations: 'from-indigo-500/10 via-indigo-300/5 to-background',
  departments: 'from-cyan-500/10 via-cyan-300/5 to-background',
  settings: 'from-gray-500/10 via-gray-300/5 to-background',
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  children,
  gradient = 'default',
  className
}) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br backdrop-blur-xl shadow-xl shadow-black/5 hover:shadow-2xl transition-all duration-500 group page-header-enhanced",
      gradientVariants[gradient],
      className
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-dots-pattern opacity-20" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/20 shadow-lg icon-wrapper-enhanced">
                <Icon className="h-8 w-8 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent animate-fade-in">
                {title}
              </h1>
              {description && (
                <p className="text-muted-foreground mt-2 text-lg animate-fade-in" style={{ animationDelay: '100ms' }}>
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {children && (
            <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
