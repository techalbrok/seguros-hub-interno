
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
interface CompaniesHeaderProps {
  onAddNewCompany?: () => void;
  onImport?: () => void;
}
export const CompaniesHeader = ({
  onAddNewCompany,
  onImport
}: CompaniesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">Compañías</h1>
        <p className="text-muted-foreground mt-1">
          Administra las compañías aseguradoras
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onImport && (
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
        )}
        {onAddNewCompany && (
          <Button onClick={onAddNewCompany} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Compañía
          </Button>
        )}
      </div>
    </div>
  );
};
