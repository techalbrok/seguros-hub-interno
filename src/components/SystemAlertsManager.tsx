
import { useState } from 'react';
import { useSystemAlertsManager, SystemAlert, NewSystemAlert } from '@/hooks/useSystemAlertsManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AlertForm, AlertFormData } from './AlertForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const getBadgeVariantForType = (type: SystemAlert['type']): 'default' | 'destructive' | 'secondary' => {
    switch (type) {
        case 'error':
            return 'destructive';
        case 'warning':
            return 'secondary';
        case 'success':
        case 'info':
        default:
            return 'default';
    }
};

export const SystemAlertsManager = () => {
    const { alerts, isLoading, createAlert, updateAlert, deleteAlert } = useSystemAlertsManager();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<SystemAlert | undefined>(undefined);
    const { toast } = useToast();

    const handleSave = async (data: AlertFormData) => {
        const payload = {
            ...data,
            expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : null,
        };

        try {
            if (selectedAlert) {
                await updateAlert({ id: selectedAlert.id, ...payload });
                toast({ title: 'Alerta actualizada', description: 'La alerta ha sido actualizada correctamente.' });
            } else {
                await createAlert(payload as NewSystemAlert);
                toast({ title: 'Alerta creada', description: 'La nueva alerta ha sido creada correctamente.' });
            }
            setDialogOpen(false);
            setSelectedAlert(undefined);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la alerta.' });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAlert(id);
            toast({ title: 'Alerta eliminada', description: 'La alerta ha sido eliminada.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar la alerta.' });
        }
    };
    
    if (isLoading) return <div><Loader2 className="h-6 w-6 animate-spin"/> Cargando alertas...</div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestión de Alertas del Sistema</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setSelectedAlert(undefined)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Crear Alerta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{selectedAlert ? 'Editar' : 'Crear'} Alerta</DialogTitle>
                        </DialogHeader>
                        <AlertForm 
                            alert={selectedAlert}
                            onSave={handleSave}
                            onCancel={() => {
                                setDialogOpen(false);
                                setSelectedAlert(undefined);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {alerts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No hay alertas del sistema.</p>
                ) : (
                    <TooltipProvider>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Alerta</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alerts.map(alert => (
                                        <TableRow key={alert.id}>
                                            <TableCell>
                                                <p className="font-semibold">{alert.title}</p>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <p className="text-sm text-muted-foreground truncate max-w-xs cursor-help">{alert.message}</p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-sm">{alert.message}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getBadgeVariantForType(alert.type)} className="capitalize">
                                                    {alert.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={alert.active ? 'default' : 'outline'}>
                                                    {alert.active ? 'Activa' : 'Inactiva'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 justify-end">
                                                    <Button variant="ghost" size="icon" onClick={() => { setSelectedAlert(alert); setDialogOpen(true); }}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta acción no se puede deshacer. Esto eliminará permanentemente la alerta.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(alert.id)}>
                                                                  Eliminar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TooltipProvider>
                )}
            </CardContent>
        </Card>
    );
};
