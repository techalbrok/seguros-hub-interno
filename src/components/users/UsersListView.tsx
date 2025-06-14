
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { UsersTable } from './UsersTable';
import { UsersGrid } from './UsersGrid';
import { User, Delegation } from '@/types';

type ViewMode = 'table' | 'grid';

interface UsersListViewProps {
  users: User[];
  delegations: Delegation[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const UsersListView = ({ users, delegations, onViewUser, onEditUser, onDeleteUser }: UsersListViewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        {viewMode === 'table' ? (
          <UsersTable users={filteredUsers} delegations={delegations} onViewUser={onViewUser} onEditUser={onEditUser} />
        ) : (
          <UsersGrid users={filteredUsers} delegations={delegations} onViewUser={onViewUser} onEditUser={onEditUser} onDeleteUser={onDeleteUser} />
        )}
      </CardContent>
    </Card>
  );
};
