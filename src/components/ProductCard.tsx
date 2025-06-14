import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, FileText } from "lucide-react";
import type { Product } from "@/types";
interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
}
export const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onView
}: ProductCardProps) => {
  return <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{product.title}</CardTitle>
        {product.documents && product.documents.length > 0 && <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="h-4 w-4 mr-1" />
            {product.documents.length} documento{product.documents.length > 1 ? 's' : ''}
          </div>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {product.process && <div>
              
              
            </div>}
          
          {product.strengths && <div>
              
              
            </div>}

          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => onView(product)} className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Ver
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="destructive-outline" size="sm" onClick={() => onDelete(product.id)} className="flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};