
import { useDemoAuth } from "@/demo/DemoAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building } from "lucide-react";

export const DemoUserProfile = () => {
  const { user } = useDemoAuth();

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No se pudo cargar el perfil de usuario de demostración.</p>
        <p className="text-sm text-muted-foreground">Por favor, inicie sesión en el modo de demostración.</p>
      </div>
    );
  }

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

  const mockDelegation = {
    name: "Delegación Demo",
    contactPerson: "Persona Contacto Demo",
    email: "delegacion.demo@correo.com",
    phone: "912345678",
    address: "Calle Falsa 123, 28080 Madrid",
    website: "https://www.example.com"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl text-sidebar-primary dark:text-white">
                Mi Perfil
              </CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sidebar-primary dark:text-white mb-4">
                  Información Personal
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={user.name}
                      readOnly
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                    <p className="text-sm text-muted-foreground">
                      El email no puede ser modificado.
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rol:</span>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sidebar-primary dark:text-white mb-4">
                  Información del Sistema
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delegación:</span>
                    <span className="font-medium text-sidebar-primary dark:text-white">
                      {mockDelegation.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Miembro desde:</span>
                    <span className="font-medium">
                      {formatDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última actualización:</span>
                    <span className="font-medium">
                      {formatDate(new Date(Date.now() - 1000 * 60 * 60 * 3))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sidebar-primary dark:text-white mb-4">
              Información de la Delegación
            </h3>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre comercial</p>
                      <p className="font-medium">{mockDelegation.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Persona de contacto</p>
                      <p className="font-medium">{mockDelegation.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{mockDelegation.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{mockDelegation.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Dirección</p>
                    <p className="font-medium">{mockDelegation.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sitio web</p>
                    <a 
                      href={mockDelegation.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {mockDelegation.website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end items-center space-x-3">
            <p className="text-sm text-muted-foreground self-center">Los cambios están deshabilitados en el modo demo.</p>
            <Button disabled>
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
