
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Grid, List } from 'lucide-react';
import { Department } from '@/hooks/useDepartments';
import { DepartmentContent } from '@/hooks/useDepartmentContent';
import { DepartmentCard } from '@/components/DepartmentCard';
import { DepartmentContentCard } from '@/components/DepartmentContentCard';

type ViewModeType = 'grid' | 'list';

interface DepartmentsTabsProps {
  view: 'departments' | 'content' | 'detail';
  onViewChange: (value: string) => void;
  viewMode: ViewModeType;
  setViewMode: (mode: ViewModeType) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredDepartments: Department[];
  filteredContent: DepartmentContent[];
  content: DepartmentContent[];
  departmentsLoading: boolean;
  contentLoading: boolean;
  onShowContentForm: () => void;
  onEditDepartment: (department: Department) => void;
  onDeleteDepartment: (id: string) => Promise<boolean>;
  onViewContent: (departmentId: string) => void;
  onEditContent: (content: DepartmentContent) => void;
  onDeleteContent: (id: string) => Promise<boolean>;
  onViewContentDetail: (content: DepartmentContent) => void;
  departmentForFilter?: Department;
}

export const DepartmentsTabs: React.FC<DepartmentsTabsProps> = ({
  view,
  onViewChange,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  filteredDepartments,
  filteredContent,
  content,
  departmentsLoading,
  contentLoading,
  onShowContentForm,
  onEditDepartment,
  onDeleteDepartment,
  onViewContent,
  onEditContent,
  onDeleteContent,
  onViewContentDetail,
  departmentForFilter,
}) => {
  // Only render tabs if view is departments or content (not detail)
  if (view === 'detail') {
    return null;
  }

  return (
    <Tabs value={view} onValueChange={onViewChange} className="w-full">
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
        ) : filteredDepartments.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredDepartments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onEdit={onEditDepartment}
                onDelete={onDeleteDepartment}
                onViewContent={onViewContent}
                contentCount={content.filter(c => c.department_id === department.id).length}
              />
            ))}
          </div>
        ) : (
           <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No se encontraron departamentos que coincidan con tu búsqueda."
                : "No hay departamentos disponibles."}
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="content" className="space-y-4">
        {departmentForFilter && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>Mostrando contenido para:</span>
            <span className="font-semibold text-foreground">{departmentForFilter.name}</span>
            <Button variant="link" size="sm" onClick={() => onViewChange('content')} className="p-0 h-auto">Ver todo</Button>
          </div>
        )}
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
        ) : filteredContent.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredContent.map((item) => (
              <DepartmentContentCard
                key={item.id}
                content={item}
                onEdit={onEditContent}
                onDelete={onDeleteContent}
                onView={onViewContentDetail}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || departmentForFilter
                ? "No se encontró contenido que coincida con tu búsqueda."
                : "No hay contenido disponible."}
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
