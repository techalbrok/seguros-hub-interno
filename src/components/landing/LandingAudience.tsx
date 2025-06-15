
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building2, Users, Package, MapPin, Network, Briefcase } from "lucide-react";

const audienceItems = [
  {
    icon: Building2,
    title: "Empresas de servicios financieros",
    description: "Centraliza la información de tus clientes y productos. Administra equipos comerciales y controla el acceso a datos sensibles.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Users,
    title: "Consultorías y asesorías",
    description: "Organiza a tus consultores en equipos, gestiona un catálogo de servicios y centraliza la documentación y metodologías de la empresa.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Package,
    title: "Distribuidoras y comercializadoras",
    description: "Gestiona tu red de proveedores y un catálogo de productos. Facilita la comunicación entre tus equipos de ventas y sucursales.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: MapPin,
    title: "Empresas con múltiples sucursales",
    description: "Administra todas tus sucursales desde una única plataforma. Comparte información y noticias relevantes con todas las sedes.",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: Network,
    title: "Organizaciones con equipos distribuidos",
    description: "Proporciona a tus equipos remotos acceso a la información y recursos que necesitan para trabajar de forma coordinada.",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: Briefcase,
    title: "Cualquier empresa que gestione proveedores",
    description: "Mantén una base de datos organizada de tus proveedores, sus contactos y los productos o servicios que ofrecen.",
    color: "from-pink-500 to-pink-600"
  },
];

export const LandingAudience = () => {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-float-delayed"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            🎯 Sectores objetivo
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Para quién es{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              HubCore?
            </span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Nuestra plataforma es versátil y se adapta a las necesidades específicas de una amplia gama de industrias y modelos de negocio.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {audienceItems.map((item, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className={`bg-gradient-to-br ${item.color} p-4 rounded-2xl w-fit mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional call-to-action */}
        <div className="mt-16 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ¿No encuentras tu sector?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              HubCore es lo suficientemente flexible para adaptarse a cualquier tipo de organización. Contáctanos y descubre cómo podemos ayudar a tu empresa específicamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Solicitar Demo Personalizada
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
                Hablar con un Experto
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

