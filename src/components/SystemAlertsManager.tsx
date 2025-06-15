import { useState } from 'react';
import { useSystemAlertsManager, SystemAlert, NewSystemAlert, UpdateSystemAlert } from '@/hooks/useSystemAlertsManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const alertSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  message: z.string().min(1, 'El mensaje es obligatorio'),
  type: z.enum(['info', 'warning', 'error', 'success']),
  active: z.boolean(),
  link: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  link_text: z.string().optional(),
  expires_at: z.string().optional(),
});

type AlertFormData = z.infer<typeof alertSchema>;

const AlertForm = ({ alert, onSave, onCancel }: { alert?: SystemAlert, onSave: (data: AlertFormData) => void, onCancel: () => void }) => {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<AlertFormData>({
        resolver: zodResolver(alertSchema),
        defaultValues: {
            title: alert?.title || '',
            message: alert?.message || '',
            type: alert?.type || 'info',
            active: alert?.active ?? true,
            link: alert?.link || '',
            link_text: alert?.link_text || '',
            expires_at: alert?.expires_at ? format(new Date(alert.expires_at), "yyyy-MM-dd'T'HH:mm") : '',
        }
    });

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="type">Tipo de Alerta</Label>
                <Controller name="type" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Información</SelectItem>
                      <SelectItem value="success">Éxito</SelectItem>
                      <SelectItem value="warning">Advertencia</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Mensaje</Label>
              <Textarea id="message" {...register('message')} />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="link">Enlace (Opcional)</Label>
                  <Input id="link" {...register('link')} placeholder="https://ejemplo.com"/>
                  {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>}
                </div>
                <div>
                  <Label htmlFor="link_text">Texto del Enlace (Opcional)</Label>
                  <Input id="link_text" {...register('link_text')} placeholder="Ver más"/>
                </div>
            </div>
            <div>
                <Label htmlFor="expires_at">Fecha de Expiración (Opcional)</Label>
                <Input id="expires_at" type="datetime-local" {...register('expires_at')} />
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="active" control={control} render={({ field }) => (
                    <Switch id="active" checked={field.value} onCheckedChange={field.onChange} />
                )} />
                <Label htmlFor="active">Activa</Label>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Alerta
                </Button>
            </div>
        </form>
    );
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
                <div className="space-y-4">
                    {alerts.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No hay alertas del sistema.</p>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-semibold">{alert.title}</p>
                                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Tipo: {alert.type} | Estado: {alert.active ? 'Activa' : 'Inactiva'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
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
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
