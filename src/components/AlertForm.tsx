
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { SystemAlert } from '@/hooks/useSystemAlertsManager';

const alertSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  message: z.string().min(1, 'El mensaje es obligatorio'),
  type: z.enum(['info', 'warning', 'error', 'success']),
  active: z.boolean(),
  link: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  link_text: z.string().optional(),
  expires_at: z.string().optional(),
});

export type AlertFormData = z.infer<typeof alertSchema>;

interface AlertFormProps {
    alert?: SystemAlert;
    onSave: (data: AlertFormData) => void;
    onCancel: () => void;
}

export const AlertForm = ({ alert, onSave, onCancel }: AlertFormProps) => {
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
