
import { Layers, Cloud, Combine, ServerCog } from "lucide-react";

const techFeatures = [
  { 
    icon: Layers, 
    title: "Stack moderno y confiable", 
    description: "Construido con tecnologías de vanguardia para garantizar rendimiento y fiabilidad excepcionales.",
    color: "from-blue-500 to-indigo-500"
  },
  { 
    icon: Cloud, 
    title: "Almacenamiento seguro en la nube", 
    description: "Accede a tu información desde cualquier lugar con la seguridad de la infraestructura cloud empresarial.",
    color: "from-cyan-500 to-blue-500"
  },
  { 
    icon: Combine, 
    title: "Acceso desde cualquier dispositivo", 
    description: "Diseño responsivo para una experiencia perfecta en ordenadores, tablets y dispositivos móviles.",
    color: "from-green-500 to-teal-500"
  },
  { 
    icon: ServerCog, 
    title: "Respaldos automáticos", 
    description: "Tu información está segura con copias de seguridad automáticas y recuperación de datos garantizada.",
    color: "from-purple-500 to-indigo-500"
  },
];

export const LandingTech = () => {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background tech pattern */}
      <div className="absolute inset-0 opacity-5">
        <img
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Código de programación"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            🔒 Tecnología empresarial
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Tecnología y{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Seguridad
            </span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Tu tranquilidad es nuestra prioridad. Usamos tecnología robusta y segura para proteger tus datos más importantes.
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {techFeatures.map((feature, index) => (
            <div key={index} className="group text-center">
              {/* Icon container with floating animation */}
              <div className="relative mb-6 flex justify-center">
                <div className={`bg-gradient-to-br ${feature.color} p-6 rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500 scale-75`}></div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust badges section */}
        <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confianza y certificaciones
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Cumplimos con los más altos estándares de seguridad y privacidad
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">ISO 27001</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
