
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, FileText } from "lucide-react";

interface ProductDocumentUploadProps {
  documents: File[];
  onDocumentsChange: (documents: File[]) => void;
}

export const ProductDocumentUpload = ({ documents, onDocumentsChange }: ProductDocumentUploadProps) => {
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onDocumentsChange([...documents, ...files]);
  };

  const removeDocument = (index: number) => {
    onDocumentsChange(documents.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Label htmlFor="documents">Documentos Específicos</Label>
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
            <p className="text-sm text-gray-500">Subir archivos</p>
          </div>
        </label>
        
        {documents.length > 0 && (
          <div className="mt-4 space-y-2">
            {documents.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(index)}
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
