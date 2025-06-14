
import { User, Delegation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

interface UserDetailProps {
  user: User;
  delegations: Delegation[];
  onBack: () => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserDetail = ({ user, delegations, onBack, onEdit, onDelete }: UserDetailProps) => {
  const delegation = delegations.find(d => d.id === user.delegationId);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(user)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => onDelete(user.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-white text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl text-sidebar-primary dark:text-white">
                {user.name}
              </CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sidebar-primary dark:text-white mb-2">
                  Información General
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rol:</span>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delegación:</span>
                    <span className="font-medium text-sidebar-primary dark:text-white">
                      {delegation ? delegation.name : 'Sin asignar'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creado:</span>
                    <span className="font-medium">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última actualización:</span>
                    <span className="font-medium">
                      {formatDate(user.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sidebar-primary dark:text-white mb-2">
                  Permisos Generales
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.permissions.canView ? "default" : "secondary"}>
                      {user.permissions.canView ? "✓" : "✗"}
                    </Badge>
                    <span className="text-sm">Visualizar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.permissions.canCreate ? "default" : "secondary"}>
                      {user.permissions.canCreate ? "✓" : "✗"}
                    </Badge>
                    <span className="text-sm">Crear</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.permissions.canEdit ? "default" : "secondary"}>
                      {user.permissions.canEdit ? "✓" : "✗"}
                    </Badge>
                    <span className="text-sm">Editar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.permissions.canDelete ? "default" : "secondary"}>
                      {user.permissions.canDelete ? "✓" : "✗"}
                    </Badge>
                    <span className="text-sm">Eliminar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {delegation && (
            <div>
              <h3 className="font-semibold text-sidebar-primary dark:text-white mb-2">
                Información de la Delegación
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre comercial</p>
                      <p className="font-medium">{delegation.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Razón social</p>
                      <p className="font-medium">{delegation.legalName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{delegation.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{delegation.email}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{delegation.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Persona de contacto</p>
                      <p className="font-medium">{delegation.contactPerson}</p>
                    </div>
                    {delegation.website && (
                      <div>
                        <p className="text-sm text-muted-foreground">Sitio web</p>
                        <a 
                          href={delegation.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {delegation.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
