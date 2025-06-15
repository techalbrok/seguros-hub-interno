
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { PageLoader } from "@/components/PageLoader";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default Index;
