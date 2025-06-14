
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-sidebar-primary dark:text-white">
            Intranet Correduría
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
