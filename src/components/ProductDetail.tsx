
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, FileText, Download } from "lucide-react";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

export const ProductDetail = ({ product, onClose, onEdit }: ProductDetailProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">{product.title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button onClick={() => onEdit(product)}>
            Editar Producto
          </Button>
        </div>

        <Separator />

        {product.process && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Proceso</h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{product.process}</p>
            </div>
          </div>
        )}

        {product.strengths && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Fortalezas</h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{product.strengths}</p>
            </div>
          </div>
        )}

        {product.observations && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Observaciones</h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{product.observations}</p>
            </div>
          </div>
        )}

        {product.documents && product.documents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.documents.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{doc.name}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>Creado: {product.createdAt.toLocaleDateString()}</p>
          <p>Actualizado: {product.updatedAt.toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};
