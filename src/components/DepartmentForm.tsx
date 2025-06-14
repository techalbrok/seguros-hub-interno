
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Department } from '@/hooks/useDepartments';

interface DepartmentFormProps {
  department?: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  isLoading?: boolean;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  open,
  onOpenChange,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    responsible_name: '',
    responsible_email: '',
    description: ''
  });

  useEffect(() => {
    if (open) {
      if (department) {
        setFormData({
          name: department.name,
          responsible_name: department.responsible_name,
          responsible_email: department.responsible_email || '',
          description: department.description || ''
        });
      } else {
        setFormData({
          name: '',
          responsible_name: '',
          responsible_email: '',
          description: ''
        });
      }
    }
  }, [department, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {department ? 'Editar Departamento' : 'Nuevo Departamento'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Departamento *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Nombre del departamento"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responsible_name">Responsable del Departamento *</Label>
              <Input
                id="responsible_name"
                value={formData.responsible_name}
                onChange={(e) => handleChange("responsible_name", e.target.value)}
                required
                placeholder="Nombre del responsable"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible_email">Email del Responsable</Label>
            <Input
              id="responsible_email"
              type="email"
              value={formData.responsible_email}
              onChange={(e) => handleChange("responsible_email", e.target.value)}
              placeholder="email@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Descripción del departamento"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : department ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
