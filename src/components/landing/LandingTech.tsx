
import { Layers, Cloud, Combine, ServerCog } from "lucide-react";

const techFeatures = [
  { icon: Layers, title: "Stack moderno y confiable", description: "Construido con tecnologías de vanguardia para garantizar rendimiento y fiabilidad." },
  { icon: Cloud, title: "Almacenamiento seguro en la nube", description: "Accede a tu información desde cualquier lugar con la seguridad de la infraestructura cloud." },
  { icon: Combine, title: "Acceso desde cualquier dispositivo", description: "Diseño responsivo para una experiencia perfecta en ordenadores, tablets y móviles." },
  { icon: ServerCog, title: "Respaldos automáticos", description: "Tu información está segura con copias de seguridad automáticas y recuperación de datos." },
];

export const LandingTech = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-sidebar-primary dark:text-white">Tecnología y Seguridad</h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Tu tranquilidad es nuestra prioridad. Usamos tecnología robusta para proteger tus datos.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {techFeatures.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mb-4">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
