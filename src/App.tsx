import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import BuilderPage from "./pages/BuilderPage";
import PortfolioPage from "./pages/PortfolioPage";
import NotFound from "./pages/NotFound";
import WelcomeInfo from "@/components/ui/WelcomeInfo";
import { useState } from "react";

const queryClient = new QueryClient();

const AppInner = ({
  showWelcome,
  setShowWelcome,
}: {
  showWelcome: boolean;
  setShowWelcome: (value: boolean) => void;
}) => {
  const navigate = useNavigate();

  const handleWelcomeComplete = (info: { name: string; email: string }) => {
    window.localStorage.setItem("welcomeInfoSubmitted", "true");
    window.localStorage.setItem("welcomeUserName", info.name);
    window.localStorage.setItem("welcomeUserEmail", info.email);
    setShowWelcome(false);
    navigate("/");
  };

  return showWelcome ? (
    <WelcomeInfo onComplete={handleWelcomeComplete} />
  ) : (
    <Routes>
      <Route path="/" element={<BuilderPage />} />
      <Route path="/u/:slug" element={<PortfolioPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.localStorage.getItem("welcomeInfoSubmitted");
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppInner showWelcome={showWelcome} setShowWelcome={setShowWelcome} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
