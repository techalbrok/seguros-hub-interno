
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, FileText } from "lucide-react";
import type { Product, ProductCategory } from "@/types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
  categories: ProductCategory[];
}
export const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onView,
  categories,
}: ProductCardProps) => {
  const category = categories.find((c) => c.id === product.categoryId);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col h-full animate-fade-in group">
      <CardHeader>
        {category && (
          <Badge variant="secondary" className="w-fit mb-2">
            {category.name}
          </Badge>
        )}
        <CardTitle className="text-xl font-bold text-sidebar-primary dark:text-white leading-tight group-hover:text-primary transition-colors">
          {product.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {product.process && (
          <div>
            <h4 className="font-semibold text-sm mb-1 text-muted-foreground">
              Proceso
            </h4>
            <p className="text-sm text-foreground/80 line-clamp-3">
              {product.process}
            </p>
          </div>
        )}
        {product.strengths && (
          <div>
            <h4 className="font-semibold text-sm mb-1 text-muted-foreground">
              Fortalezas
            </h4>
            <p className="text-sm text-foreground/80 line-clamp-3">
              {product.strengths}
            </p>
          </div>
        )}
        {product.documents && product.documents.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground pt-2">
            <FileText className="h-4 w-4 mr-2" />
            <span>
              {product.documents.length} documento
              {product.documents.length > 1 ? "s" : ""} adjunto
              {product.documents.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(product)}
            className="flex-1 min-w-[80px]"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1 min-w-[80px]"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="destructive-outline"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="flex-1 min-w-[80px]"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
};
