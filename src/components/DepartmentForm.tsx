
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Department } from '@/hooks/useDepartments';

interface DepartmentFormProps {
  department?: Department;
  onSubmit: (data: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  onCancel: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: department?.name || '',
    responsible_name: department?.responsible_name || '',
    responsible_email: department?.responsible_email || '',
    description: department?.description || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        name: '',
        responsible_name: '',
        responsible_email: '',
        description: ''
      });
      onCancel();
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {department ? 'Editar Departamento' : 'Nuevo Departamento'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Departamento</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="responsible_name">Responsable del Departamento</Label>
            <Input
              id="responsible_name"
              value={formData.responsible_name}
              onChange={(e) => setFormData(prev => ({ ...prev, responsible_name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="responsible_email">Email del Responsable</Label>
            <Input
              id="responsible_email"
              type="email"
              value={formData.responsible_email}
              onChange={(e) => setFormData(prev => ({ ...prev, responsible_email: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : department ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
