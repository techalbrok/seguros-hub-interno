
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBrokerageConfig } from "@/hooks/useBrokerageConfig";

export const LandingHeader = () => {
  const { config } = useBrokerageConfig();
  const brokerageName = config?.name || "Intranet Correduría";
  const logoUrl = config?.logo_url;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <Link to="/landing" className="flex items-center space-x-2">
          {logoUrl && <img src={logoUrl} alt={`Logo de ${brokerageName}`} className="h-6 w-auto" />}
          <span className="font-bold">{brokerageName}</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link to="/demo">
              <Button variant="outline">Ver Demo</Button>
            </Link>
            <Link to="/login">
              <Button>Acceder</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
