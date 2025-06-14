import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Grid, List, Trash2 } from "lucide-react";
import { UsersTable } from './UsersTable';
import { UsersGrid } from './UsersGrid';
import { User, Delegation } from '@/types';
import { AppPagination } from '../ui/AppPagination';
import { UserTableRowSkeleton, UserCardSkeleton } from '../skeletons/UserSkeletons';
import { Table, TableBody, TableHeader } from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ViewMode = 'table' | 'grid';

interface UsersListViewProps {
  users: User[];
  delegations: Delegation[];
  loading: boolean;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onBulkDelete: (userIds: string[]) => void;
}

export const UsersListView = ({ users, delegations, loading, onViewUser, onEditUser, onDeleteUser, onBulkDelete }: UsersListViewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [delegationFilter, setDelegationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const usersPerPage = viewMode === 'grid' ? 6 : 5;

  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter === 'all' || user.role === roleFilter) &&
    (delegationFilter === 'all' || user.delegationId === delegationFilter)
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  useEffect(() => {
    setSelectedUserIds([]);
  }, [currentPage, viewMode, searchTerm, roleFilter, delegationFilter]);

  const handleSelectUser = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedUserIds(paginatedUsers.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleBulkDeleteClick = () => {
    onBulkDelete(selectedUserIds);
    setSelectedUserIds([]);
  }

  const SkeletonView = () => (
    viewMode === 'table' ? (
      <Table>
        <TableHeader>
          <UsersTable 
            users={[]} 
            delegations={[]} 
            onViewUser={()=>{}} 
            onEditUser={()=>{}} 
            selectedUserIds={[]}
            onSelectUser={()=>{}}
            onSelectAll={()=>{}}
            areAllOnPageSelected={false}
          />
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => <UserTableRowSkeleton key={i} />)}
        </TableBody>
      </Table>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <UserCardSkeleton key={i} />)}
      </div>
    )
  );

  const numSelected = selectedUserIds.length;
  const areAllOnPageSelected = viewMode === 'table' && paginatedUsers.length > 0 && numSelected === paginatedUsers.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-sidebar-primary dark:text-white">
              Lista de Usuarios
            </CardTitle>
            {numSelected > 0 && viewMode === 'table' && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">{numSelected} seleccionado(s)</span>
                <Button variant="destructive" size="sm" onClick={handleBulkDeleteClick}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>
          {numSelected === 0 && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-48"
              />
              <Select value={roleFilter} onValueChange={(value) => { setRoleFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
              <Select value={delegationFilter} onValueChange={(value) => { setDelegationFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Delegación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las delegaciones</SelectItem>
                  {delegations.map(delegation => (
                    <SelectItem key={delegation.id} value={delegation.id}>
                      {delegation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-1 border rounded-md p-1 self-center sm:ml-auto">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <SkeletonView /> : (
          viewMode === 'table' ? (
            <UsersTable 
              users={paginatedUsers} 
              delegations={delegations} 
              onViewUser={onViewUser} 
              onEditUser={onEditUser} 
              selectedUserIds={selectedUserIds}
              onSelectUser={handleSelectUser}
              onSelectAll={handleSelectAll}
              areAllOnPageSelected={areAllOnPageSelected}
            />
          ) : (
            <UsersGrid users={paginatedUsers} delegations={delegations} onViewUser={onViewUser} onEditUser={onEditUser} onDeleteUser={onDeleteUser} />
          )
        )}
      </CardContent>
      {totalPages > 1 && !loading && (
        <CardFooter>
          <AppPagination 
            totalPages={totalPages} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage}
            className="mx-auto" 
          />
        </CardFooter>
      )}
    </Card>
  );
};
