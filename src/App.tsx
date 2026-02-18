import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import BuilderPage from "./pages/BuilderPage";
import PortfolioPage from "./pages/PortfolioPage";
import NotFound from "./pages/NotFound";
import WelcomeInfo from "@/components/ui/WelcomeInfo";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

type RuntimeMode = "checking" | "builder" | "exported";

const isValidExportProfile = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;
  const maybeProfile = value as { name?: unknown };
  return (
    typeof maybeProfile.name === "string" && maybeProfile.name.trim().length > 0
  );
};

const detectExportedRuntime = async () => {
  try {
    const res = await fetch(`/profile.json?ts=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return false;
    const payload = (await res.json()) as unknown;
    return isValidExportProfile(payload);
  } catch {
    return false;
  }
};

const AppInner = ({
  runtimeMode,
  showWelcome,
  setShowWelcome,
}: {
  runtimeMode: RuntimeMode;
  showWelcome: boolean;
  setShowWelcome: (value: boolean) => void;
}) => {
  const navigate = useNavigate();
  const isExportBuild = runtimeMode === "exported";

  const handleWelcomeComplete = (info: { name: string; email: string }) => {
    window.localStorage.setItem("welcomeInfoSubmitted", "true");
    window.localStorage.setItem("welcomeUserName", info.name);
    window.localStorage.setItem("welcomeUserEmail", info.email);
    setShowWelcome(false);
    navigate("/");
  };

  if (runtimeMode === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Preparing your workspace...
      </div>
    );
  }

  return !isExportBuild && showWelcome ? (
    <WelcomeInfo onComplete={handleWelcomeComplete} />
  ) : (
    <Routes>
      <Route
        path="/"
        element={isExportBuild ? <PortfolioPage exported /> : <BuilderPage />}
      />
      {isExportBuild ? <Route path="/builder" element={<BuilderPage />} /> : null}
      <Route path="/u/:slug" element={<PortfolioPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [runtimeMode, setRuntimeMode] = useState<RuntimeMode>(() =>
    import.meta.env.MODE === "export" ? "exported" : "checking",
  );
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (runtimeMode !== "checking") return;

    let cancelled = false;
    const welcomeWasSubmitted = Boolean(
      window.localStorage.getItem("welcomeInfoSubmitted"),
    );

    (async () => {
      const isExportedRuntime = await detectExportedRuntime();
      if (cancelled) return;

      if (isExportedRuntime) {
        setRuntimeMode("exported");
        setShowWelcome(false);
        return;
      }

      setRuntimeMode("builder");
      setShowWelcome(!welcomeWasSubmitted);
    })();

    return () => {
      cancelled = true;
    };
  }, [runtimeMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppInner
            runtimeMode={runtimeMode}
            showWelcome={showWelcome}
            setShowWelcome={setShowWelcome}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
