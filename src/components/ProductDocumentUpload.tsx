import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ProductDocument } from "@/types";

interface ProductDocumentUploadProps {
  documents: File[];
  existingDocuments?: ProductDocument[];
  productId?: string;
  onDocumentsChange: (documents: File[]) => void;
  onExistingDocumentDelete?: (documentId: string) => void;
}

export const ProductDocumentUpload = ({ 
  documents, 
  existingDocuments = [],
  productId,
  onDocumentsChange,
  onExistingDocumentDelete
}: ProductDocumentUploadProps) => {
  const { toast } = useToast();

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onDocumentsChange([...documents, ...files]);
  };

  const removeDocument = (index: number) => {
    onDocumentsChange(documents.filter((_, i) => i !== index));
  };

  const handleDeleteExistingDocument = async (documentId: string, documentUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = documentUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${productId}/${fileName}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('product-documents')
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('product_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Éxito",
        description: "Documento eliminado correctamente",
      });

      if (onExistingDocumentDelete) {
        onExistingDocumentDelete(documentId);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el documento",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Label htmlFor="documents">Documentos Específicos</Label>
      
      {/* Existing Documents */}
      {existingDocuments.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Documentos actuales</h4>
          <div className="space-y-2">
            {existingDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-blue-50 p-2 rounded border">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">{doc.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                      Descargar
                    </a>
                  </Button>
                  {productId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExistingDocument(doc.id, doc.url)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Documents Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          id="documents"
          multiple
          onChange={handleDocumentChange}
          className="hidden"
        />
        <label htmlFor="documents" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Subir nuevos archivos</p>
          </div>
        </label>
        
        {documents.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Nuevos documentos a subir</h4>
            {documents.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded border">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
