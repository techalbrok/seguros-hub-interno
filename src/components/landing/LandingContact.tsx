
import { Mail } from "lucide-react";
import { useEffect } from "react";

export const LandingContact = () => {
  useEffect(() => {
    const scriptId = 'mailrelay-iframe-script';
    // Evita añadir el script si ya existe
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "https://assets.ipzmarketing.com/assets/signup_form/iframe_v1.js";
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script);

    // Limpia el script cuando el componente se desmonte
    return () => {
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  return (
    <section id="contacto" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
            <Mail className="w-4 h-4 mr-2" />
            Contacto
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Listo para empezar?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Habla con un experto
            </span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Completa el siguiente formulario y uno de nuestros especialistas se pondrá en contacto contigo para ofrecerte una solución a medida.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Formulario de Contacto
            </h3>
            {/* MailRelay form embedded via iframe */}
            <div className="min-h-[480px]">
              <iframe 
                data-skip-lazy="" 
                src="https://josebaezfernandez.ipzmarketing.com/f/icZSvTMP8EE" 
                frameBorder="0"
                scrolling="no" 
                width="100%" 
                className="ipz-iframe"
                title="Formulario de Contacto MailRelay"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
