
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Upload, Image } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  imageUrl?: string;
  uploading: boolean;
  onImageChange: (url: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  imageUrl,
  uploading,
  onImageChange,
  onImageUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <Label htmlFor="featured_image">{label}</Label>
      <div className="space-y-4">
        {imageUrl && (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Vista previa"
              className="w-full max-w-md h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onImageChange('')}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <Label
            htmlFor="image-upload"
            className="flex items-center space-x-2 cursor-pointer bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors"
          >
            {uploading ? (
              <Upload className="w-4 h-4 animate-spin" />
            ) : (
              <Image className="w-4 h-4" />
            )}
            <span>{uploading ? 'Subiendo...' : 'Subir Imagen'}</span>
          </Label>
        </div>
      </div>
    </div>
  );
};
