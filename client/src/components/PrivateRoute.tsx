import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export function PrivateRoute({ children, requiredRole = "user" }: PrivateRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  if (requiredRole === "admin" && user?.role !== "admin") {
    navigate("/");
    return null;
  }

  return <>{children}</>;
}
