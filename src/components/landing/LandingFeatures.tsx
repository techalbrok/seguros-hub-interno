
import { Users, Building, Building2, Package, Briefcase, Newspaper } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const features = [
  { icon: Users, title: "Gestión de Usuarios", description: "Controla roles, permisos y accesos de todo tu equipo de forma centralizada." },
  { icon: Building, title: "Delegaciones", description: "Administra todas tus delegaciones y su personal desde un único panel de control." },
  { icon: Building2, title: "Compañías Aseguradoras", description: "Mantén una base de datos completa de compañías, con sus productos y condiciones." },
  { icon: Package, title: "Productos", description: "Cataloga y consulta rápidamente toda la información sobre los productos que ofreces." },
  { icon: Briefcase, title: "Departamentos", description: "Organiza la información y los recursos internos por departamentos para una mayor eficiencia." },
  { icon: Newspaper, title: "Noticias y Comunicados", description: "Mantén a todo tu equipo informado con un portal de noticias internas fácil de usar." },
];

export const LandingFeatures = () => {
  return (
    <section className="container py-24 sm:py-32 bg-muted/40 dark:bg-muted/20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold">Todo lo que necesitas, y más</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Una suite de herramientas diseñadas para simplificar la complejidad de la gestión de una correduría de seguros moderna.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-background/80">
            <CardHeader>
              <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
