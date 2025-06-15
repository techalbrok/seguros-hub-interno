
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";

const Index = () => {
  const { user } = useAuth();

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
