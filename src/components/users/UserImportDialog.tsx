
import { useState, useCallback, useMemo } from 'react';
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
import { Delegation } from '@/types';
import { CreateUserData } from '@/hooks/users/types';

// Based on CreateUserPage defaults
const ADMIN_PERMISSIONS = {
  users: { canCreate: true, canEdit: true, canDelete: true, canView: true },
  delegations: { canCreate: true, canEdit: true, canDelete: true, canView: true },
  companies: { canCreate: true, canEdit: true, canDelete: true, canView: true },
  products: { canCreate: true, canEdit: true, canDelete: true, canView: true },
  department_content: { canCreate: true, canEdit: true, canDelete: true, canView: true },
  news: { canCreate: true, canEdit: true, canDelete: true, canView: true },
};

const USER_PERMISSIONS = {
  users: { canCreate: false, canEdit: false, canDelete: false, canView: true },
  delegations: { canCreate: false, canEdit: false, canDelete: false, canView: true },
  companies: { canCreate: false, canEdit: false, canDelete: false, canView: true },
  products: { canCreate: false, canEdit: false, canDelete: false, canView: true },
  department_content: { canCreate: false, canEdit: false, canDelete: false, canView: true },
  news: { canCreate: false, canEdit: false, canDelete: false, canView: true },
};


interface UserImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBulkCreate: (users: CreateUserData[]) => Promise<any>;
  delegations: Delegation[];
}

type ParsedUser = CreateUserData & { errors?: string[] };

export const UserImportDialog = ({ open, onOpenChange, onBulkCreate, delegations }: UserImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedUser[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const delegationsMap = useMemo(() => new Map(delegations.map(d => [d.name.toLowerCase(), d.id])), [delegations]);

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
          const user: ParsedUser = {
            name: row.name || '',
            email: row.email || '',
            password: row.password || '',
            role: row.role || 'user',
            permissions: {},
            errors: []
          };
          
          if (!user.name) user.errors?.push('El nombre es obligatorio.');
          if (!user.email) user.errors?.push('El email es obligatorio.');
          if (!user.password) user.errors?.push('La contraseña es obligatoria.');
          if (user.role !== 'admin' && user.role !== 'user') {
            user.errors?.push("El rol debe ser 'admin' o 'user'.");
          } else {
            user.permissions = user.role === 'admin' ? ADMIN_PERMISSIONS : USER_PERMISSIONS;
          }

          if (row.delegation_name) {
            const delegationId = delegationsMap.get(row.delegation_name.toLowerCase());
            if (delegationId) {
              user.delegationId = delegationId;
            } else {
              user.errors?.push(`La delegación '${row.delegation_name}' no existe.`);
            }
          }

          return user;
        });
        setParsedData(validatedData);
      },
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileParse(acceptedFiles[0]);
    }
  }, [delegationsMap]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });
  
  const handleImport = async () => {
    const validUsers = parsedData.filter(u => u.errors?.length === 0);
    if(validUsers.length === 0) return;

    setIsProcessing(true);
    await onBulkCreate(validUsers);
    setIsProcessing(false);
    onOpenChange(false);
  };
  
  const validUsersCount = parsedData.filter(d => d.errors?.length === 0).length;
  const invalidUsersCount = parsedData.length - validUsersCount;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) resetState(); onOpenChange(isOpen); }}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importar Usuarios desde CSV</DialogTitle>
          <DialogDescription>
            Sube un fichero CSV con los usuarios a crear. Las columnas requeridas son: <strong>name, email, password, role</strong>. Opcionalmente, puedes añadir <strong>delegation_name</strong>.
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
            
            {invalidUsersCount > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Se encontraron errores</AlertTitle>
                  <AlertDescription>
                    {invalidUsersCount} fila(s) tienen errores y no serán importadas. Revisa la tabla de previsualización.
                  </AlertDescription>
                </Alert>
            )}
             {validUsersCount > 0 && invalidUsersCount === 0 && (
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-300">¡Todo correcto!</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Se importarán {validUsersCount} usuarios.
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
                    <TableHead>Rol</TableHead>
                    <TableHead>Delegación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((row, index) => (
                    <TableRow key={index} className={row.errors && row.errors.length > 0 ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                      <TableCell>
                        {row.errors && row.errors.length > 0 ? (
                           <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertCircle className="h-5 w-5 text-destructive" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{row.errors.join(' ')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell>{row.delegationId ? delegations.find(d => d.id === row.delegationId)?.name : 'N/A'}</TableCell>
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
                disabled={!file || validUsersCount === 0 || isProcessing}
            >
                {isProcessing ? 'Importando...' : `Importar ${validUsersCount} usuarios`}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Need to add Tooltip components for error display
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

