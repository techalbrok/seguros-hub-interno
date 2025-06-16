
import { RichTextEditor } from "@/components/RichTextEditor";
import { useEffect } from "react";

interface ProductRichTextFieldsProps {
  formData: {
    process: string;
    strengths: string;
    observations: string;
  };
  onFormDataChange: (data: any) => void;
}

export const ProductRichTextFields = ({ formData, onFormDataChange }: ProductRichTextFieldsProps) => {
  return (
    <div className="space-y-6">
      <RichTextEditor
        label="Proceso"
        value={formData.process || ""}
        onChange={(value) => onFormDataChange({ ...formData, process: value })}
        placeholder="Describe el proceso del producto..."
      />

      <RichTextEditor
        label="Fortalezas"
        value={formData.strengths || ""}
        onChange={(value) => onFormDataChange({ ...formData, strengths: value })}
        placeholder="Describe las fortalezas del producto..."
      />

      <RichTextEditor
        label="Observaciones"
        value={formData.observations || ""}
        onChange={(value) => onFormDataChange({ ...formData, observations: value })}
        placeholder="Añade observaciones sobre el producto..."
      />
    </div>
  );
};
