
import { Users, Building, Building2, Package, Briefcase, Newspaper } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const features = [
  { 
    icon: Users, 
    title: "Gestión de Equipos", 
    description: "Control total sobre usuarios, roles y permisos con una interfaz intuitiva.",
    color: "from-blue-500 to-blue-600"
  },
  { 
    icon: Building, 
    title: "Gestión de Oficinas/Sucursales", 
    description: "Administra múltiples ubicaciones desde un panel centralizado y eficiente.",
    color: "from-green-500 to-green-600"
  },
  { 
    icon: Building2, 
    title: "Red de Proveedores", 
    description: "Base de datos completa de proveedores y partners estratégicos.",
    color: "from-purple-500 to-purple-600"
  },
  { 
    icon: Package, 
    title: "Catálogo de Productos/Servicios", 
    description: "Organiza y gestiona tu oferta comercial de forma eficiente y profesional.",
    color: "from-orange-500 to-orange-600"
  },
  { 
    icon: Briefcase, 
    title: "Departamentos Internos", 
    description: "Estructura organizacional clara y eficiente para optimizar tus equipos.",
    color: "from-indigo-500 to-indigo-600"
  },
  { 
    icon: Newspaper, 
    title: "Comunicación Interna", 
    description: "Portal de noticias y comunicados corporativos fácil de usar y gestionar.",
    color: "from-pink-500 to-pink-600"
  },
];

export const LandingFeatures = () => {
  return (
    <section className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 opacity-50"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            🚀 Funcionalidades principales
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Una solución,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              infinitas posibilidades
            </span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            HubCore se adapta a tu negocio. Nuestras herramientas están diseñadas para escalar y evolucionar contigo, optimizando cada área de tu empresa.
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:scale-105 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-2xl w-fit mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
