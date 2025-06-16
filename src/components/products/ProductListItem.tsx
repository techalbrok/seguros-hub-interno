
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { Product, ProductCategory } from "@/types";

interface ProductListItemProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onView: (product: Product) => void;
  categories: ProductCategory[];
}

const stripHtmlTags = (html: string) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

export const ProductListItem = ({ product, onEdit, onDelete, onView, categories }: ProductListItemProps) => {
  const category = categories.find((c) => c.id === product.categoryId);
  const processText = product.process ? stripHtmlTags(product.process) : "";

  return (
    <TableRow key={product.id} className="hover:bg-muted/50 animate-fade-in">
      <TableCell>
        <div className="font-medium text-sidebar-primary dark:text-white line-clamp-2">{product.title}</div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {category ? <Badge variant="secondary">{category.name}</Badge> : <span className="text-muted-foreground">-</span>}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <p className="text-sm text-foreground/80 line-clamp-1">
          {processText || <span className="text-muted-foreground">N/A</span>}
        </p>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
           <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(product)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Ver</span>
          </Button>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(product)}
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
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
