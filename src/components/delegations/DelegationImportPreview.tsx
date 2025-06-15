
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CreateDelegationData } from './DelegationImportDialog';

type ParsedDelegation = CreateDelegationData & { errors?: string[] };

interface DelegationImportPreviewProps {
  file: File;
  parsedData: ParsedDelegation[];
  onReset: () => void;
  t: { plural: string };
  validCount: number;
  invalidCount: number;
}

export const DelegationImportPreview = ({ file, parsedData, onReset, t, validCount, invalidCount }: DelegationImportPreviewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-2 border rounded-md">
        <FileText className="h-8 w-8 text-primary" />
        <div className="flex-grow">
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-muted-foreground">{parsedData.length} filas encontradas</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>Cambiar fichero</Button>
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
              Se importarán {validCount} {t.plural.toLowerCase()}.
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
  );
};
