
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDepartments, Department } from '@/hooks/useDepartments';
import { useDepartmentContent, DepartmentContent } from '@/hooks/useDepartmentContent';
import { DepartmentForm } from '@/components/DepartmentForm';
import { DepartmentContentForm } from '@/components/DepartmentContentForm';
import { DepartmentContentDetail } from '@/components/DepartmentContentDetail';
import { DepartmentsTabs } from './DepartmentsTabs';
import { useAuth } from '@/hooks/useAuth'; // <--- Nuevo import

type ViewType = 'departments' | 'content' | 'detail';

const Departments = () => {
  const [view, setView] = useState<ViewType>('departments');
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingContent, setEditingContent] = useState<DepartmentContent | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedContent, setSelectedContent] = useState<DepartmentContent | null>(null);

  const {
    departments,
    createDepartment,
    updateDepartment,
    isCreating,
    isUpdating
  } = useDepartments();

  const {
    createContent,
    updateContent,
    uploadImage
  } = useDepartmentContent();

  const { isAdmin } = useAuth(); // <--- Saber si es admin

  const handleDepartmentSubmit = async (data: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingDepartment) {
      const success = await updateDepartment(editingDepartment.id, data);
      if (success) {
        setEditingDepartment(null);
      }
      return success;
    } else {
      return await createDepartment(data);
    }
  };

  const handleContentSubmit = async (data: {
    title: string;
    content: string;
    department_id: string;
    featured_image?: string;
    published?: boolean;
  }) => {
    if (editingContent) {
      const success = await updateContent(editingContent.id, data);
      if (success) {
        setEditingContent(null);
        setShowContentForm(false);
      }
      return success;
    } else {
      const success = await createContent(data);
      if (success) {
        setShowContentForm(false);
      }
      return success;
    }
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setShowDepartmentForm(true);
  };

  const handleEditContent = (content: DepartmentContent) => {
    setEditingContent(content);
    setShowContentForm(true);
  };

  const handleViewContent = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setView('content');
  };

  const handleViewContentDetail = (content: DepartmentContent) => {
    setSelectedContent(content);
    setView('detail');
  };

  const handleViewChange = (value: string) => {
    setView(value as ViewType);
  };

  const handleClearDepartmentFilter = () => {
    setSelectedDepartmentId('');
  };

  const onFormOpenChange = (isOpen: boolean) => {
    setShowDepartmentForm(isOpen);
    if (!isOpen) {
      setEditingDepartment(null);
    }
  };

  if (showContentForm) {
    return (
      <div className="p-6">
        <DepartmentContentForm 
          departments={departments}
          content={editingContent || undefined}
          onSubmit={handleContentSubmit}
          onCancel={() => {
            setShowContentForm(false);
            setEditingContent(null);
          }}
          onUploadImage={uploadImage}
        />
      </div>
    );
  }

  if (view === 'detail' && selectedContent) {
    return (
      <div className="p-6">
        <DepartmentContentDetail 
          content={selectedContent}
          onBack={() => {
            setView('content');
            setSelectedContent(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Departamentos</h1>
        <div className="flex gap-2">
          {view === 'content' && isAdmin && (
            <Button onClick={() => setShowContentForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Entrada
            </Button>
          )}
          {isAdmin && (
            <Button onClick={() => setShowDepartmentForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Departamento
            </Button>
          )}
        </div>
      </div>

      <DepartmentsTabs
        view={view as 'departments' | 'content'}
        onViewChange={handleViewChange}
        selectedDepartmentId={selectedDepartmentId}
        onClearDepartmentFilter={handleClearDepartmentFilter}
        onViewContent={handleViewContent}
        onEditDepartment={isAdmin ? handleEditDepartment : undefined}  // Solo admins pueden editar departamento
        onEditContent={handleEditContent}
        onViewContentDetail={handleViewContentDetail}
      />

      <DepartmentForm
        open={showDepartmentForm}
        onOpenChange={onFormOpenChange}
        department={editingDepartment || undefined}
        onSubmit={handleDepartmentSubmit}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default Departments;

