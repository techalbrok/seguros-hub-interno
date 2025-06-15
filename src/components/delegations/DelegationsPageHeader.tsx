import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import { memo } from 'react';

interface DelegationsPageHeaderProps {
  t: { singular: string; plural: string; };
  onCreateClick?: () => void;
  onImportClick?: () => void;
}

export const DelegationsPageHeader = ({ t, onCreateClick, onImportClick }: DelegationsPageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-sidebar-primary dark:text-white">
        {t.plural}
      </h1>
      <p className="text-muted-foreground mt-2">
        Gestiona y consulta tus {t.plural.toLowerCase()}
      </p>
    </div>
    <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-auto">
      {onImportClick && (
        <Button variant="outline" onClick={onImportClick}>
          Importar CSV
        </Button>
      )}
      {onCreateClick && (
        <Button onClick={onCreateClick}>
          Nueva {t.singular}
        </Button>
      )}
    </div>
  </div>
);

DelegationsPageHeader.displayName = "DelegationsPageHeader";
