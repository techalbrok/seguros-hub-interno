
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/users" element={
              <Layout>
                <Users />
              </Layout>
            } />
            <Route path="/delegations" element={
              <Layout>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white mb-4">
                    Gestión de Delegaciones
                  </h1>
                  <p className="text-muted-foreground">Próximamente disponible</p>
                </div>
              </Layout>
            } />
            <Route path="/companies" element={
              <Layout>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white mb-4">
                    Gestión de Compañías
                  </h1>
                  <p className="text-muted-foreground">Próximamente disponible</p>
                </div>
              </Layout>
            } />
            <Route path="/products" element={
              <Layout>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white mb-4">
                    Gestión de Productos
                  </h1>
                  <p className="text-muted-foreground">Próximamente disponible</p>
                </div>
              </Layout>
            } />
            <Route path="/department-content" element={
              <Layout>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white mb-4">
                    Contenido por Departamento
                  </h1>
                  <p className="text-muted-foreground">Próximamente disponible</p>
                </div>
              </Layout>
            } />
            <Route path="/news" element={
              <Layout>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold text-sidebar-primary dark:text-white mb-4">
                    Gestión de Noticias
                  </h1>
                  <p className="text-muted-foreground">Próximamente disponible</p>
                </div>
              </Layout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
