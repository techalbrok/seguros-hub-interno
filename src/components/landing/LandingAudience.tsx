
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const audienceItems = [
  "Empresas de servicios financieros",
  "Consultorías y asesorías",
  "Distribuidoras y comercializadoras",
  "Empresas con múltiples sucursales",
  "Organizaciones con equipos distribuidos",
  "Cualquier empresa que gestione proveedores y productos",
];

export const LandingAudience = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-sidebar-primary dark:text-white">¿Para quién es HubCore?</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Nuestra plataforma es versátil y se adapta a las necesidades de una amplia gama de industrias y modelos de negocio.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {audienceItems.map((item, index) => (
          <Card key={index} className="bg-card hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-lg font-medium">{item}</CardTitle>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};
