import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("admin_logged_in");
      const session = localStorage.getItem("admin_session");
      
      if (!isLoggedIn || !session) {
        setIsAuthenticated(false);
        return;
      }
      
      // تحقق من انتهاء الجلسة (24 ساعة)
      const sessionTime = parseInt(session);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (now - sessionTime > twentyFourHours) {
        localStorage.removeItem("admin_logged_in");
        localStorage.removeItem("admin_session");
        setIsAuthenticated(false);
        return;
      }
      
      setIsAuthenticated(true);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>جاري التحقق من صلاحية الوصول...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}