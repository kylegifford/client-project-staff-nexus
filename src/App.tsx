
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";

// Pages
import Dashboard from "./pages/Dashboard";
import CustomersList from "./pages/customers/CustomersList";
import CustomerDetail from "./pages/customers/CustomerDetail";
import CustomerForm from "./pages/customers/CustomerForm";
import ProjectsList from "./pages/projects/ProjectsList";
import ProjectDetail from "./pages/projects/ProjectDetail";
import ProjectForm from "./pages/projects/ProjectForm";
import ProjectAssign from "./pages/projects/ProjectAssign";
import EmployeesList from "./pages/employees/EmployeesList";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import EmployeeForm from "./pages/employees/EmployeeForm";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Auth is disabled, redirect /auth to main app */}
              <Route path="/auth" element={<Navigate to="/" replace />} />
              
              {/* Protected Routes - authentication temporarily bypassed */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  
                  {/* Customer Routes */}
                  <Route path="/customers" element={<CustomersList />} />
                  <Route path="/customers/:id" element={<CustomerDetail />} />
                  <Route path="/customers/new" element={<CustomerForm />} />
                  <Route path="/customers/edit/:id" element={<CustomerForm />} />
                  
                  {/* Project Routes */}
                  <Route path="/projects" element={<ProjectsList />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/projects/new" element={<ProjectForm />} />
                  <Route path="/projects/edit/:id" element={<ProjectForm />} />
                  <Route path="/projects/assign/:id" element={<ProjectAssign />} />
                  
                  {/* Employee Routes */}
                  <Route path="/employees" element={<EmployeesList />} />
                  <Route path="/employees/:id" element={<EmployeeDetail />} />
                  <Route path="/employees/new" element={<EmployeeForm />} />
                  <Route path="/employees/edit/:id" element={<EmployeeForm />} />
                </Route>
              </Route>
              
              {/* Not Found - redirect to main app */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
