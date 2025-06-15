
import { CompanyCard } from "@/components/CompanyCard";
import type { Company } from "@/types";

interface CompaniesGridProps {
  companies: Company[];
  onEdit?: (company: Company) => void;
  onDelete?: (id: string) => void;
  onView: (company: Company) => void;
}

export const CompaniesGrid = ({
  companies,
  onEdit,
  onDelete,
  onView,
}: CompaniesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};
