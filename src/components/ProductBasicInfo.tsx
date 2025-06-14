
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductCategories } from "@/hooks/useProductCategories";
import { useCompanies } from "@/hooks/useCompanies";

interface ProductBasicInfoProps {
  formData: {
    title: string;
    categoryId: string;
    companyId: string;
  };
  onFormDataChange: (data: any) => void;
}

export const ProductBasicInfo = ({ formData, onFormDataChange }: ProductBasicInfoProps) => {
  const { categories } = useProductCategories();
  const { companies } = useCompanies();

  const handleCategoryChange = (value: string) => {
    const categoryId = value === "no-category" ? "" : value;
    onFormDataChange({ ...formData, categoryId });
  };

  const handleCompanyChange = (value: string) => {
    const companyId = value === "no-company" ? "" : value;
    onFormDataChange({ ...formData, companyId });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="categoryId">Categoría</Label>
        <Select
          value={formData.categoryId || "no-category"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-category">Sin categoría</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {"—".repeat(category.level - 1)} {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="companyId">Compañía</Label>
        <Select
          value={formData.companyId || "no-company"}
          onValueChange={handleCompanyChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar compañía" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-company">Sin compañía</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
