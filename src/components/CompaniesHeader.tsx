import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useBrokerageConfig } from "@/hooks/useBrokerageConfig";
interface CompaniesHeaderProps {
  onAddNewCompany?: () => void;
  onImport?: () => void;
}
export const CompaniesHeader = ({
  onAddNewCompany,
  onImport
}: CompaniesHeaderProps) => {
  const {
    config: brokerageConfig
  } = useBrokerageConfig();
  const companyTerminology = brokerageConfig?.terminology?.company || {
    singular: "Compañía",
    plural: "Compañías"
  };
  return <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        {brokerageConfig && brokerageConfig.logo_url && <div className="flex items-center gap-3 mb-2">
            
            
          </div>}
        <h1 className="text-3xl font-bold text-sidebar-primary dark:text-white">{companyTerminology.plural}</h1>
        <p className="text-muted-foreground mt-1">
          Administra las {companyTerminology.plural.toLowerCase()} aseguradoras
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onImport && <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>}
        {onAddNewCompany && <Button onClick={onAddNewCompany} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva {companyTerminology.singular}
          </Button>}
      </div>
    </div>;
};