
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";

interface UsersStatsProps {
  users: User[];
}

export const UsersStats = ({ users }: UsersStatsProps) => {
  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sidebar-primary dark:text-white">
            {users.length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {adminCount} administradores
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Administradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sidebar-primary dark:text-white">
            {adminCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Con permisos completos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Usuarios Estándar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sidebar-primary dark:text-white">
            {userCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Con permisos limitados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
