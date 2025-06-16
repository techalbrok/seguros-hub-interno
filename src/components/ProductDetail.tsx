
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FileText, Download } from "lucide-react";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: Product) => void;
  canEdit?: boolean;
}

export const ProductDetail = ({ product, open, onOpenChange, onEdit, canEdit }: ProductDetailProps) => {
  if (!product) {
    return null;
  }

  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          <div className="flex gap-2">
            {canEdit && (
              <Button onClick={() => onEdit(product)}>
                Editar Producto
              </Button>
            )}
          </div>

          <Separator />

          {product.process && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Proceso</h3>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert 
                          prose-headings:text-foreground prose-headings:font-semibold
                          prose-p:text-foreground prose-p:leading-relaxed
                          prose-strong:text-foreground prose-strong:font-semibold
                          prose-em:text-foreground 
                          prose-ul:text-foreground prose-ol:text-foreground 
                          prose-li:text-foreground prose-li:my-1
                          prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 
                          prose-blockquote:text-foreground prose-blockquote:border-l-primary
                          prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:rounded
                          [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3
                          [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2
                          [&_h3]:text-base [&_h3]:font-medium [&_h3]:mb-2
                          [&_p]:mb-3 [&_p:last-child]:mb-0
                          [&_ul]:my-3 [&_ol]:my-3
                          [&_li]:mb-1" 
                dangerouslySetInnerHTML={createMarkup(product.process)} 
              />
            </div>
          )}

          {product.strengths && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Fortalezas</h3>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert 
                          prose-headings:text-foreground prose-headings:font-semibold
                          prose-p:text-foreground prose-p:leading-relaxed
                          prose-strong:text-foreground prose-strong:font-semibold
                          prose-em:text-foreground 
                          prose-ul:text-foreground prose-ol:text-foreground 
                          prose-li:text-foreground prose-li:my-1
                          prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 
                          prose-blockquote:text-foreground prose-blockquote:border-l-primary
                          prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:rounded
                          [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3
                          [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2
                          [&_h3]:text-base [&_h3]:font-medium [&_h3]:mb-2
                          [&_p]:mb-3 [&_p:last-child]:mb-0
                          [&_ul]:my-3 [&_ol]:my-3
                          [&_li]:mb-1" 
                dangerouslySetInnerHTML={createMarkup(product.strengths)} 
              />
            </div>
          )}

          {product.observations && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Observaciones</h3>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert 
                          prose-headings:text-foreground prose-headings:font-semibold
                          prose-p:text-foreground prose-p:leading-relaxed
                          prose-strong:text-foreground prose-strong:font-semibold
                          prose-em:text-foreground 
                          prose-ul:text-foreground prose-ol:text-foreground 
                          prose-li:text-foreground prose-li:my-1
                          prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 
                          prose-blockquote:text-foreground prose-blockquote:border-l-primary
                          prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:rounded
                          [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3
                          [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2
                          [&_h3]:text-base [&_h3]:font-medium [&_h3]:mb-2
                          [&_p]:mb-3 [&_p:last-child]:mb-0
                          [&_ul]:my-3 [&_ol]:my-3
                          [&_li]:mb-1" 
                dangerouslySetInnerHTML={createMarkup(product.observations)} 
              />
            </div>
          )}

          {product.documents && product.documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Documentos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.documents.map((doc) => (
                  <div key={doc.id} className="p-4 border rounded-lg bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">{doc.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground pt-4 border-t">
            <p>Creado: {new Date(product.createdAt).toLocaleDateString()}</p>
            <p>Actualizado: {new Date(product.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
