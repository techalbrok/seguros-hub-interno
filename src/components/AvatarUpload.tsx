
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onUploadComplete: (url: string) => void;
  name: string;
}

export const AvatarUpload = ({ currentAvatarUrl, onUploadComplete, name }: AvatarUploadProps) => {
  const { uploadImage, uploading } = useImageUpload('avatars');
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const tempPreview = URL.createObjectURL(file);
      setPreview(tempPreview);
      const publicUrl = await uploadImage(file);
      if (publicUrl) {
        onUploadComplete(publicUrl);
      } else {
        setPreview(currentAvatarUrl || null);
        URL.revokeObjectURL(tempPreview);
      }
    }
  }, [uploadImage, onUploadComplete, currentAvatarUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.jpg'] },
    multiple: false,
  });

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div {...getRootProps()} className="relative group w-24 h-24 cursor-pointer">
      <input {...getInputProps()} />
      <Avatar className="h-24 w-24 text-3xl">
        <AvatarImage src={preview || currentAvatarUrl || undefined} alt={name} />
        <AvatarFallback className="bg-muted">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <div className="text-center">
            <UploadCloud className="h-8 w-8 mx-auto" />
            <p className="text-xs mt-1">{isDragActive ? 'Suelta para subir' : 'Cambiar foto'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
