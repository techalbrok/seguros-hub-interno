
import { useState, useCallback } from 'react';
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
import { useBrokerageConfig, defaultTerminology } from '@/hooks/useBrokerageConfig';
import { DelegationImportDropzone } from './DelegationImportDropzone';
import { DelegationImportPreview } from './DelegationImportPreview';

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
  const { config } = useBrokerageConfig();
  const t = config?.terminology?.delegation || defaultTerminology.delegation;

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setIsProcessing(false);
  };

  const handleFileParse = (fileToParse: File) => {
    setFile(fileToParse);
    Papa.parse<any>(fileToParse, {
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
          <DialogTitle>Importar {t.plural} desde CSV</DialogTitle>
          <DialogDescription>
            Sube un fichero CSV con las {t.plural.toLowerCase()} a crear. Las columnas requeridas son: <strong>name, legal_name, address, phone, email, contact_person</strong>. Opcionalmente: <strong>website</strong>.
          </DialogDescription>
        </DialogHeader>

        {!file ? (
          <DelegationImportDropzone onDrop={onDrop} />
        ) : (
          <DelegationImportPreview 
            file={file}
            parsedData={parsedData}
            onReset={resetState}
            t={t}
            validCount={validCount}
            invalidCount={invalidCount}
          />
        )}

        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button 
                onClick={handleImport} 
                disabled={!file || validCount === 0 || isProcessing}
            >
                {isProcessing ? 'Importando...' : `Importar ${validCount} ${t.plural.toLowerCase()}`}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
