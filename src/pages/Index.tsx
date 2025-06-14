
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerageConfig } from "@/hooks/useBrokerageConfig";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

const Index = () => {
  const { user } = useAuth();
  const { config } = useBrokerageConfig();

  if (!user) {
    const brokerageName = config?.name || "Intranet Correduría";
    const logoUrl = config?.logo_url;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-6">
          {logoUrl && (
            <div className="flex justify-center mb-6">
              <img 
                src={logoUrl} 
                alt={`Logo de ${brokerageName}`}
                className="h-16 w-auto object-contain"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-sidebar-primary dark:text-white">
            {brokerageName}
          </h1>
          <p className="text-xl text-muted-foreground">
            Sistema de gestión interno
          </p>
          <Link to="/login">
            <Button size="lg">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
