
import { Button } from "@/components/ui/button";
import { Building, Plus } from "lucide-react";
import { memo } from 'react';

interface DelegationsEmptyStateProps {
  t: { plural: string, singular: string };
  hasSearchTerm: boolean;
  onCreateClick: () => void;
}

export const DelegationsEmptyState = memo(({ t, hasSearchTerm, onCreateClick }: DelegationsEmptyStateProps) => (
  <div className="text-center py-12">
    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium text-sidebar-primary dark:text-white mb-2">
      {hasSearchTerm ? `No se encontraron ${t.plural.toLowerCase()}` : `No hay ${t.plural.toLowerCase()}`}
    </h3>
    <p className="text-muted-foreground mb-4">
      {hasSearchTerm
        ? "Intenta con otros términos de búsqueda"
        : `Comienza creando tu primera ${t.singular.toLowerCase()}`
      }
    </p>
    {!hasSearchTerm && (
      <Button onClick={onCreateClick}>
        <Plus className="h-4 w-4 mr-2" />
        Nueva {t.singular}
      </Button>
    )}
  </div>
));

DelegationsEmptyState.displayName = "DelegationsEmptyState";
