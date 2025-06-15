
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const LandingHeader = () => {
  const brokerageName = "HubCore";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <Link to="/landing" className="flex items-center space-x-2">
          <span className="font-bold text-lg">{brokerageName}</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link to="/demo/dashboard">
              <Button variant="outline">Explorar Demo</Button>
            </Link>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="#contacto">Hablar con un Experto</a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
