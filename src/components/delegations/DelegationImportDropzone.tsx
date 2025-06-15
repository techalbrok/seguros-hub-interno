
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface DelegationImportDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

export const DelegationImportDropzone = ({ onDrop }: DelegationImportDropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors">
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
      {isDragActive ? (
        <p className="mt-4">Suelta el fichero aquí...</p>
      ) : (
        <p className="mt-4">Arrastra un fichero CSV o haz clic para seleccionarlo</p>
      )}
    </div>
  );
};
