
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  return (
    <section className="container flex flex-col items-center py-24 sm:py-32 text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-sidebar-primary dark:text-white">
        La plataforma de gestión definitiva para corredurías de seguros
      </h1>
      <p className="mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground">
        Centraliza, optimiza y acelera todas tus operaciones. Desde la gestión de usuarios y compañías hasta la comunicación interna. Todo en un solo lugar.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/demo">
          <Button size="lg">Explora la Demo</Button>
        </Link>
        <Link to="/login">
          <Button size="lg" variant="outline">
            Acceder al sistema
          </Button>
        </Link>
      </div>
    </section>
  );
};
