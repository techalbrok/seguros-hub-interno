
import { useDemoAuth } from "./DemoAuthContext";
import { Navigate } from "react-router-dom";

export const DemoAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useDemoAuth();
  if (!user) {
    return <Navigate to="/demo/login" replace />;
  }
  return <>{children}</>;
};
