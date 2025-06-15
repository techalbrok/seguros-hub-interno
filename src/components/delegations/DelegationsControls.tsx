
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Grid3X3, List } from "lucide-react";

interface DelegationsControlsProps {
  t: { plural: string };
  filteredCount: number;
  totalCount: number;
  viewMode: 'grid' | 'list';
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const DelegationsControls = ({ t, filteredCount, totalCount, viewMode, searchTerm, onSearchTermChange, onViewModeChange }: DelegationsControlsProps) => (
  <>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span>{t.plural}</span>
        <Badge variant="secondary">
          {filteredCount} de {totalCount}
        </Badge>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="flex items-center space-x-4 mt-6 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={`Buscar ${t.plural.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  </>
);
