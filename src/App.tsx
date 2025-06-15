import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthGuard } from "@/components/AuthGuard";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PageLoader } from "@/components/PageLoader";
import { AuthProvider } from "@/hooks/useAuth";
import { DemoAuthProvider } from "./demo/DemoAuthContext";
import { DemoLayout } from "./demo/DemoLayout";
import { DemoLogin } from "./demo/DemoLogin";
import { DemoAuthGuard } from "./demo/DemoAuthGuard";
import { DemoDashboard } from "./demo/DemoDashboard";
import { DemoUsers } from "./demo/DemoUsers";
import { DemoDelegations } from "./demo/DemoDelegations";
import { DemoCompanies } from "./demo/DemoCompanies";
import { DemoProducts } from "./demo/DemoProducts";
import { DemoDepartments } from "./demo/DemoDepartments";
import { DemoNews } from "./demo/DemoNews";

const Index = lazy(() => import("./pages/Index"));
const Landing = lazy(() => import("./pages/Landing"));
const Demo = lazy(() => import("./pages/Demo"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const Users = lazy(() => import("./pages/Users"));
const Delegations = lazy(() => import("./pages/Delegations"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Companies = lazy(() => import("./pages/Companies"));
const Products = lazy(() => import("./pages/Products"));
const Departments = lazy(() => import("./pages/Departments"));
const News = lazy(() => import("./pages/News"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route path="/demo/login" element={
                  <DemoAuthProvider>
                    <DemoLogin />
                  </DemoAuthProvider>
                } />
                <Route path="/demo/dashboard" element={
                  <DemoAuthProvider>
                    <DemoAuthGuard>
                      <DemoLayout>
                        <DemoDashboard />
                      </DemoLayout>
                    </DemoAuthGuard>
                  </DemoAuthProvider>
                } />
                <Route path="/demo/users" element={
                  <DemoAuthProvider>
                    <DemoAuthGuard>
                      <DemoLayout>
                        <DemoUsers />
                      </DemoLayout>
                    </DemoAuthGuard>
                  </DemoAuthProvider>
                } />
                <Route path="/demo/delegations" element={
                  <DemoAuthProvider>
                    <DemoAuthGuard>
                      <DemoLayout>
                        <DemoDelegations />
                      </DemoLayout>
                    </DemoAuthGuard>
                  </DemoAuthProvider>
                } />
                <Route path="/demo/companies" element={
                  <DemoAuthProvider>
                    <DemoAuthGuard>
                      <DemoLayout>
                        <DemoCompanies />
                      </DemoLayout>
                    </DemoAuthGuard>
                  </DemoAuthProvider>
                } />
                <Route path="/demo/products" element={
                  <DemoAuthProvider>
                    <DemoAuthGuard>
                      <DemoLayout>
                        <DemoProducts />
                      </DemoLayout>
                    </DemoAuthGuard>
                  </DemoAuthProvider>
                } />
                <Route path="/demo/departments" element={
                  <DemoAuthProvider>
                    <DemoAuthGuard>
                      <DemoLayout>
                        <DemoDepartments />
                      </DemoLayout>
                    </DemoAuthGuard>
                  </DemoAuthProvider>
                } />
                <Route path="/demo/news" element={
                  <DemoAuthProvider>
                    <DemoAuthGuard>
                      <DemoLayout>
                        <DemoNews />
                      </DemoLayout>
                    </DemoAuthGuard>
                  </DemoAuthProvider>
                } />
                <Route path="/demo" element={<Demo />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <AuthGuard>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="/profile" element={
                  <AuthGuard>
                    <Layout>
                      <Profile />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="/settings" element={
                  <AuthGuard>
                    <Layout>
                      <Settings />
                    </Layout>
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
                <Route path="/departments" element={
                  <AuthGuard>
                    <Layout>
                      <Departments />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="/news" element={
                  <AuthGuard>
                    <Layout>
                      <News />
                    </Layout>
                  </AuthGuard>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
