import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background cyber-grid">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <AlertTriangle className="w-20 h-20 mx-auto text-destructive mb-4 pulse-cyber" />
          <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-destructive/30 rounded-full animate-ping" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-card-foreground">Security Zone Not Found</h2>
          <p className="text-muted-foreground">
            The requested security module or page could not be located in the SecureOps system.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button asChild>
            <a href="/">
              <Home className="w-4 h-4 mr-2" />
              Security Dashboard
            </a>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Error Code: SEC_404 | Path: {location.pathname}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
