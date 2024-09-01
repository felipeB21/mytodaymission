import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Spinner } from "@nextui-org/spinner";

interface RedirectProp {
  children: ReactNode;
}

export const RedirectAuthenticatedUser: React.FC<RedirectProp> = ({
  children,
}) => {
  const { me, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await me();
      setLoading(false);
    };

    checkAuth();
  }, [me]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[65dvh]">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const ProtectedRoute: React.FC<RedirectProp> = ({ children }) => {
  const { me, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await me();
      setLoading(false);
    };

    checkAuth();
  }, [me]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[65dvh]">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
