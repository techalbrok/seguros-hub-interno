
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, FileText } from "lucide-react";
import type { Product, ProductCategory } from "@/types";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onView: (product: Product) => void;
  categories: ProductCategory[];
}

const stripHtmlTags = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

export const ProductCard = ({ product, onEdit, onDelete, onView, categories }: ProductCardProps) => {
  const category = categories.find((c) => c.id === product.categoryId);
  const processText = product.process ? stripHtmlTags(product.process) : "";
  const strengthsText = product.strengths ? stripHtmlTags(product.strengths) : "";

  return (
    <Card className="h-full animate-fade-in hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 pr-2">{product.title}</CardTitle>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(product)}
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver</span>
            </Button>
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(product)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(product.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {category && (
            <Badge variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          )}
          {product.documents && product.documents.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              {product.documents.length} docs
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {processText && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Proceso</h4>
              <p className="text-sm line-clamp-2">{processText}</p>
            </div>
          )}
          {strengthsText && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Fortalezas</h4>
              <p className="text-sm line-clamp-2">{strengthsText}</p>
            </div>
          )}
        </div>
        <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
          Actualizado: {new Date(product.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
