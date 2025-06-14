
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Grid, List } from 'lucide-react';
import { Department } from '@/hooks/useDepartments';
import { DepartmentContent } from '@/hooks/useDepartmentContent';
import { DepartmentCard } from '@/components/DepartmentCard';
import { DepartmentContentCard } from '@/components/DepartmentContentCard';

type ViewType = 'departments' | 'content';
type ViewModeType = 'grid' | 'list';

interface DepartmentsTabsProps {
  view: ViewType;
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
  onViewContentDetail
}) => {
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
        ) : (
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
                onEdit={onEditContent}
                onDelete={onDeleteContent}
                onView={onViewContentDetail}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
