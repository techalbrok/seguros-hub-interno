
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

const Index = lazy(() => import("./pages/Index"));
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/" element={<Index />} />
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
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
