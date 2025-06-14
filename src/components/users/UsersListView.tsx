
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { UsersTable } from './UsersTable';
import { UsersGrid } from './UsersGrid';
import { User, Delegation } from '@/types';
import { AppPagination } from '../ui/AppPagination';
import { UserTableRowSkeleton, UserCardSkeleton } from '../skeletons/UserSkeletons';
import { Table, TableBody, TableHeader } from '../ui/table';

type ViewMode = 'table' | 'grid';

interface UsersListViewProps {
  users: User[];
  delegations: Delegation[];
  loading: boolean;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const UsersListView = ({ users, delegations, loading, onViewUser, onEditUser, onDeleteUser }: UsersListViewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = viewMode === 'grid' ? 6 : 5;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const SkeletonView = () => (
    viewMode === 'table' ? (
      <Table>
        <TableHeader>
          <UsersTable users={[]} delegations={[]} onViewUser={()=>{}} onEditUser={()=>{}} />
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sidebar-primary dark:text-white">
            Lista de Usuarios
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <div className="flex items-center space-x-1 border rounded-md p-1">
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
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <SkeletonView /> : (
          viewMode === 'table' ? (
            <UsersTable users={paginatedUsers} delegations={delegations} onViewUser={onViewUser} onEditUser={onEditUser} />
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
