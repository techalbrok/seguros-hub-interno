
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CompaniesHeaderProps {
  onAddNewCompany: () => void;
}

export const CompaniesHeader = ({ onAddNewCompany }: CompaniesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">
          Gestión de Compañías
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra las compañías aseguradoras
        </p>
      </div>
      <Button onClick={onAddNewCompany} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Nueva Compañía
      </Button>
    </div>
  );
};
