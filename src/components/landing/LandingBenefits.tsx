
import { DatabaseZap, Zap, MessagesSquare, Scaling, ShieldCheck, GitMerge } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: DatabaseZap, title: "Centralización de información", description: "Accede a todos tus datos críticos desde un único lugar seguro y organizado." },
  { icon: Zap, title: "Mejora en la productividad", description: "Automatiza tareas, optimiza flujos de trabajo y potencia el rendimiento de tu equipo." },
  { icon: MessagesSquare, title: "Comunicación interna efectiva", description: "Fomenta la colaboración y mantén a todos informados con herramientas integradas." },
  { icon: Scaling, title: "Escalabilidad empresarial", description: "Una plataforma que crece contigo, adaptándose a tus necesidades futuras." },
  { icon: ShieldCheck, title: "Seguridad y control de accesos", description: "Protege tu información con roles, permisos y los más altos estándares de seguridad." },
  { icon: GitMerge, title: "Integración de procesos", description: "Conecta diferentes áreas de tu empresa para una gestión más fluida y eficiente." },
];

export const LandingBenefits = () => {
  return (
    <section className="container py-24 sm:py-32 bg-muted/40 dark:bg-muted/20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-sidebar-primary dark:text-white">Beneficios Universales</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Descubre cómo HubCore puede impulsar la eficiencia y el crecimiento en tu organización.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-background/80 text-center">
            <CardHeader className="items-center p-6">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-fit mb-4">
                <benefit.icon className="w-8 h-8" />
              </div>
              <CardTitle>{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{benefit.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
