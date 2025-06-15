
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Grid, List } from "lucide-react";

interface ProductControlsProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  viewType: 'grid' | 'list';
  onViewTypeChange: (view: 'grid' | 'list') => void;
  onAddNew: () => void;
  canCreate?: boolean;
}

export const ProductControls = ({
  searchTerm,
  onSearchTermChange,
  viewType,
  onViewTypeChange,
  onAddNew,
  canCreate,
}: ProductControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 w-full">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant={viewType === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => onViewTypeChange('grid')}>
          <Grid className="h-4 w-4" />
        </Button>
        <Button variant={viewType === 'list' ? 'default' : 'outline'} size="sm" onClick={() => onViewTypeChange('list')}>
          <List className="h-4 w-4" />
        </Button>
        {canCreate && (
          <Button onClick={onAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        )}
      </div>
    </div>
  );
};
