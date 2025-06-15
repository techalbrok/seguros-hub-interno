
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  return (
    <section className="container flex flex-col items-center py-24 sm:py-32 text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-sidebar-primary dark:text-white">
        La plataforma de gestión que unifica tu empresa
      </h1>
      <p className="mt-6 max-w-3xl text-lg sm:text-xl text-muted-foreground">
        Centraliza equipos, proveedores, productos y comunicación. Una solución integral para empresas que buscan eficiencia, control y crecimiento.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/demo">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Explora la Demo</Button>
        </Link>
        <Link to="/login">
          <Button size="lg" variant="outline">
            Login
          </Button>
        </Link>
      </div>
    </section>
  );
};
