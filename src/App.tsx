
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthGuard } from "@/components/AuthGuard";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Delegations from "./pages/Delegations";
import NotFound from "./pages/NotFound";
import Companies from "./pages/Companies";
import Products from "./pages/Products";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <AuthGuard>
                <Index />
              </AuthGuard>
            } />
            <Route path="/users" element={
              <AuthGuard>
                <Layout>
                  <Users />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/delegations" element={
              <AuthGuard>
                <Layout>
                  <Delegations />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/companies" element={
              <AuthGuard>
                <Layout>
                  <Companies />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/products" element={
              <AuthGuard>
                <Layout>
                  <Products />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/department-content" element={
              <AuthGuard>
                <Layout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white mb-4">
                      Contenido por Departamento
                    </h1>
                    <p className="text-muted-foreground">Próximamente disponible</p>
                  </div>
                </Layout>
              </AuthGuard>
            } />
            <Route path="/news" element={
              <AuthGuard>
                <Layout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white mb-4">
                      Gestión de Noticias
                    </h1>
                    <p className="text-muted-foreground">Próximamente disponible</p>
                  </div>
                </Layout>
              </AuthGuard>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
