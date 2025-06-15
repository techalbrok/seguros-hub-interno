
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import { memo } from 'react';

interface DelegationsPageHeaderProps {
  t: { plural: string, singular: string };
  onImportClick: () => void;
  onCreateClick: () => void;
}

export const DelegationsPageHeader = memo(({ t, onImportClick, onCreateClick }: DelegationsPageHeaderProps) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white">
        Gestión de {t.plural}
      </h1>
      <p className="text-muted-foreground">
        Gestiona las {t.plural.toLowerCase()} y su información
      </p>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" onClick={onImportClick}>
        <Upload className="h-4 w-4 mr-2" />
        Importar CSV
      </Button>
      <Button onClick={onCreateClick}>
        <Plus className="h-4 w-4 mr-2" />
        Nueva {t.singular}
      </Button>
    </div>
  </div>
));

DelegationsPageHeader.displayName = "DelegationsPageHeader";
