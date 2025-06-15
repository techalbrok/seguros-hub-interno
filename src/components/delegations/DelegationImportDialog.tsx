
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CreateDelegationData {
  name: string;
  legalName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  contactPerson: string;
}

interface DelegationImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBulkCreate: (delegations: CreateDelegationData[]) => Promise<any>;
}

type ParsedDelegation = CreateDelegationData & { errors?: string[] };

export const DelegationImportDialog = ({ open, onOpenChange, onBulkCreate }: DelegationImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedDelegation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setIsProcessing(false);
  };

  const handleFileParse = (file: File) => {
    setFile(file);
    Papa.parse<any>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validatedData = results.data.map(row => {
          const delegation: ParsedDelegation = {
            name: row.name || '',
            legalName: row.legal_name || '',
            address: row.address || '',
            phone: row.phone || '',
            email: row.email || '',
            contactPerson: row.contact_person || '',
            website: row.website,
            errors: []
          };
          
          if (!delegation.name) delegation.errors?.push('El nombre es obligatorio.');
          if (!delegation.legalName) delegation.errors?.push('El nombre legal es obligatorio.');
          if (!delegation.address) delegation.errors?.push('La dirección es obligatoria.');
          if (!delegation.phone) delegation.errors?.push('El teléfono es obligatorio.');
          if (!delegation.email) delegation.errors?.push('El email es obligatorio.');
          if (!delegation.contactPerson) delegation.errors?.push('La persona de contacto es obligatoria.');
          
          return delegation;
        });
        setParsedData(validatedData);
      },
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileParse(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });
  
  const handleImport = async () => {
    const validDelegations = parsedData.filter(d => d.errors?.length === 0);
    if(validDelegations.length === 0) return;

    setIsProcessing(true);
    await onBulkCreate(validDelegations.map(({ errors, ...delegationData }) => delegationData));
    setIsProcessing(false);
    onOpenChange(false);
  };
  
  const validCount = parsedData.filter(d => d.errors?.length === 0).length;
  const invalidCount = parsedData.length - validCount;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) resetState(); onOpenChange(isOpen); }}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importar Delegaciones desde CSV</DialogTitle>
          <DialogDescription>
            Sube un fichero CSV con las delegaciones a crear. Las columnas requeridas son: <strong>name, legal_name, address, phone, email, contact_person</strong>. Opcionalmente: <strong>website</strong>.
          </DialogDescription>
        </DialogHeader>

        {!file ? (
          <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors">
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            {isDragActive ? (
              <p className="mt-4">Suelta el fichero aquí...</p>
            ) : (
              <p className="mt-4">Arrastra un fichero CSV o haz clic para seleccionarlo</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-2 border rounded-md">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-grow">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{parsedData.length} filas encontradas</p>
              </div>
              <Button variant="ghost" size="sm" onClick={resetState}>Cambiar fichero</Button>
            </div>
            
            {invalidCount > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Se encontraron errores</AlertTitle>
                  <AlertDescription>
                    {invalidCount} fila(s) tienen errores y no serán importadas. Revisa la tabla de previsualización.
                  </AlertDescription>
                </Alert>
            )}
             {validCount > 0 && invalidCount === 0 && (
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-300">¡Todo correcto!</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Se importarán {validCount} delegaciones.
                  </AlertDescription>
                </Alert>
            )}

            <ScrollArea className="h-[300px] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estado</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Errores</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((row, index) => (
                    <TableRow key={index} className={row.errors && row.errors.length > 0 ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                      <TableCell>
                        {row.errors && row.errors.length > 0 ? (
                           <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.contactPerson}</TableCell>
                      <TableCell>
                        {row.errors && row.errors.length > 0 && (
                           <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-destructive text-sm cursor-pointer underline">
                                  {row.errors.length} error(es)
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{row.errors.join(' ')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button 
                onClick={handleImport} 
                disabled={!file || validCount === 0 || isProcessing}
            >
                {isProcessing ? 'Importando...' : `Importar ${validCount} delegaciones`}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
