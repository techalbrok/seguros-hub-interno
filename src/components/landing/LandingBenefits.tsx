
import { DatabaseZap, Zap, MessagesSquare, Scaling, ShieldCheck, GitMerge } from "lucide-react";

const benefits = [
  { 
    icon: DatabaseZap, 
    title: "Centralización de información", 
    description: "Consolida en un solo lugar la información de tus equipos, sucursales, proveedores y productos para un acceso rápido y unificado.",
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    icon: Zap, 
    title: "Mejora en la productividad", 
    description: "Reduce el tiempo de búsqueda de información al tener todos los datos de contacto y catálogos en un solo lugar, agilizando la operativa diaria.",
    gradient: "from-yellow-500 to-orange-500"
  },
  { 
    icon: MessagesSquare, 
    title: "Comunicación interna efectiva", 
    description: "Utiliza el portal de noticias para compartir comunicados importantes, manteniendo a toda la organización informada de las últimas novedades.",
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    icon: Scaling, 
    title: "Escalabilidad empresarial", 
    description: "Añade nuevos usuarios, sucursales o productos a medida que tu empresa crece, sin necesidad de cambiar de sistema.",
    gradient: "from-purple-500 to-indigo-500"
  },
  { 
    icon: ShieldCheck, 
    title: "Seguridad y control de accesos", 
    description: "Define roles y permisos específicos para cada usuario, asegurando que cada persona acceda únicamente a la información que le corresponde.",
    gradient: "from-red-500 to-pink-500"
  },
  { 
    icon: GitMerge, 
    title: "Integración de procesos", 
    description: "Facilita la colaboración entre departamentos al compartir una única fuente de verdad sobre proveedores, productos y estructura organizativa.",
    gradient: "from-teal-500 to-blue-500"
  },
];

export const LandingBenefits = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background with company image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Profesionales trabajando"
          className="w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-gray-900/95 dark:to-gray-800/95"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            💎 Beneficios clave
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Beneficios{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Universales
            </span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Descubre cómo HubCore puede impulsar la eficiencia y el crecimiento en tu organización, sin importar tu industria.
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="group relative">
              {/* Card */}
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 hover:scale-105 hover:-translate-y-2">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`bg-gradient-to-br ${benefit.gradient} p-4 rounded-2xl w-fit shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
