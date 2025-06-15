
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container relative z-10 flex flex-col lg:flex-row items-center py-24 sm:py-32 gap-12">
        {/* Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            ✨ Plataforma de gestión empresarial
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            La plataforma que{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              transforma
            </span>{" "}
            tu organización
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Centraliza equipos, proveedores, productos y comunicación interna. Una solución integral para empresas que buscan eficiencia y crecimiento sostenible.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link to="/demo">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Explorar Demo
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg transition-all duration-300">
                Solicitar Demo Personalizada
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Seguro y confiable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Escalable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Fácil de usar</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 relative">
          <div className="relative z-10">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Equipo trabajando colaborativamente"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
        </div>
      </div>
    </section>
  );
};
