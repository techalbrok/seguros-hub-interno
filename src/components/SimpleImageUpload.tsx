
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Upload, Image } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface SimpleImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  accept?: string;
  placeholder?: string;
}

export const SimpleImageUpload: React.FC<SimpleImageUploadProps> = ({
  onUpload,
  currentImage,
  accept = "image/*",
  placeholder = "Subir imagen"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload('brokerage-assets');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        onUpload(url);
      }
    }
  };

  const handleRemoveImage = () => {
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative">
          <img
            src={currentImage}
            alt="Vista previa"
            className="w-full max-w-md h-48 object-contain rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="simple-image-upload"
        />
        <Label
          htmlFor="simple-image-upload"
          className="flex items-center space-x-2 cursor-pointer bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md"
        >
          {uploading ? (
            <Upload className="w-4 h-4 animate-spin" />
          ) : (
            <Image className="w-4 h-4" />
          )}
          <span>{uploading ? 'Subiendo...' : placeholder}</span>
        </Label>
      </div>
    </div>
  );
};
