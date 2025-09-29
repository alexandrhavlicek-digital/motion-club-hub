import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { GuestLogin } from "./pages/GuestLogin";
import { ProgramPage } from "./pages/ProgramPage";
import { MyActivitiesPage } from "./pages/MyActivitiesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AnimatorLogin } from "./pages/AnimatorLogin";
import { AnimatorDashboard } from "./pages/AnimatorDashboard";
import { AnimatorRegistrations } from "./pages/AnimatorRegistrations";
import { AnimatorAddRegistration } from "./pages/AnimatorAddRegistration";
import { AnimatorRemoveRegistration } from "./pages/AnimatorRemoveRegistration";
import { AnimatorProfile } from "./pages/AnimatorProfile";
import { useMotionAuth } from "./hooks/useMotionAuth";

const queryClient = new QueryClient();

// Protected Route Component for Guests
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role, isLoading } = useMotionAuth();
  
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Načítám...</p>
      </div>
    </div>;
  }
  
  if (!isAuthenticated || role !== 'guest') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Protected Route Component for Animators
const AnimatorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role, isLoading } = useMotionAuth();
  
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Načítám...</p>
      </div>
    </div>;
  }
  
  if (!isAuthenticated || role !== 'animator') {
    return <Navigate to="/animator/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<GuestLogin />} />
          <Route path="/program" element={
            <ProtectedRoute>
              <ProgramPage />
            </ProtectedRoute>
          } />
          <Route path="/my-activities" element={
            <ProtectedRoute>
              <MyActivitiesPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          {/* Animator Routes */}
          <Route path="/animator/login" element={<AnimatorLogin />} />
          <Route path="/animator/dashboard" element={<AnimatorRoute><AnimatorDashboard /></AnimatorRoute>} />
          <Route path="/animator/registrations" element={<AnimatorRoute><AnimatorRegistrations /></AnimatorRoute>} />
          <Route path="/animator/add" element={<AnimatorRoute><AnimatorAddRegistration /></AnimatorRoute>} />
          <Route path="/animator/remove" element={<AnimatorRoute><AnimatorRemoveRegistration /></AnimatorRoute>} />
          <Route path="/animator/profile" element={<AnimatorRoute><AnimatorProfile /></AnimatorRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
