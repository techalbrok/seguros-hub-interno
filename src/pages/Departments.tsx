
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Grid, List } from 'lucide-react';
import { useDepartments, Department } from '@/hooks/useDepartments';
import { useDepartmentContent, DepartmentContent } from '@/hooks/useDepartmentContent';
import { DepartmentForm } from '@/components/DepartmentForm';
import { DepartmentCard } from '@/components/DepartmentCard';
import { DepartmentContentForm } from '@/components/DepartmentContentForm';
import { DepartmentContentCard } from '@/components/DepartmentContentCard';
import { DepartmentContentDetail } from '@/components/DepartmentContentDetail';

type ViewType = 'departments' | 'content' | 'detail';
type ViewModeType = 'grid' | 'list';

const Departments = () => {
  const [view, setView] = useState<ViewType>('departments');
  const [viewMode, setViewMode] = useState<ViewModeType>('grid');
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingContent, setEditingContent] = useState<DepartmentContent | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedContent, setSelectedContent] = useState<DepartmentContent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    departments,
    loading: departmentsLoading,
    createDepartment,
    updateDepartment,
    deleteDepartment
  } = useDepartments();

  const {
    content,
    loading: contentLoading,
    createContent,
    updateContent,
    deleteContent,
    uploadImage
  } = useDepartmentContent();

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.responsible_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDepartmentSubmit = async (data: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingDepartment) {
      const success = await updateDepartment(editingDepartment.id, data);
      if (success) {
        setEditingDepartment(null);
        setShowDepartmentForm(false);
      }
      return success;
    } else {
      const success = await createDepartment(data);
      if (success) {
        setShowDepartmentForm(false);
      }
      return success;
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

  if (showDepartmentForm) {
    return (
      <div className="p-6">
        <DepartmentForm
          department={editingDepartment || undefined}
          onSubmit={handleDepartmentSubmit}
          onCancel={() => {
            setShowDepartmentForm(false);
            setEditingDepartment(null);
          }}
        />
      </div>
    );
  }

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Departamentos</h1>
        <div className="flex gap-2">
          {view === 'content' && (
            <Button onClick={() => setShowContentForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Entrada
            </Button>
          )}
          <Button onClick={() => setShowDepartmentForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Departamento
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={handleViewChange} className="w-full">
        <TabsList>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar departamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {departmentsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredDepartments.map((department) => (
                <DepartmentCard
                  key={department.id}
                  department={department}
                  onEdit={handleEditDepartment}
                  onDelete={deleteDepartment}
                  onViewContent={handleViewContent}
                  contentCount={content.filter(c => c.department_id === department.id).length}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {contentLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredContent.map((item) => (
                <DepartmentContentCard
                  key={item.id}
                  content={item}
                  onEdit={handleEditContent}
                  onDelete={deleteContent}
                  onView={handleViewContentDetail}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Departments;
