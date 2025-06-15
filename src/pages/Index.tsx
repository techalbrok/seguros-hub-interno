
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { PageLoader } from "@/components/PageLoader";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
