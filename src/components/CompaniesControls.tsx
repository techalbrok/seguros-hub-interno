
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Search, Grid, List } from "lucide-react";

type DisplayMode = "list" | "grid";

interface CompaniesControlsProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  activeDisplayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
  companyCount: number;
}

export const CompaniesControls = ({
  searchTerm,
  onSearchTermChange,
  activeDisplayMode,
  onDisplayModeChange,
  companyCount,
}: CompaniesControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <CardTitle>Compañías ({companyCount})</CardTitle>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar compañías..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        <div className="flex border rounded-md">
          <Button
            variant={activeDisplayMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onDisplayModeChange("grid")}
            className="rounded-r-none"
            aria-label="Vista de cuadrícula"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={activeDisplayMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onDisplayModeChange("list")}
            className="rounded-l-none"
            aria-label="Vista de lista"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
