
import { Mail } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const LandingContact = () => {
  return (
    <section id="contacto" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            <Mail className="w-4 h-4 mr-2" />
            Suscripción
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Quieres estar al día?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Suscríbete a nuestro boletín
            </span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Recibe en tu correo las últimas novedades, consejos y ofertas especiales. Solo tienes que dejar tu nombre y email.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Formulario de Suscripción
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};
