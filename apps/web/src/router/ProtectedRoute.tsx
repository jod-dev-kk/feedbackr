import DashboardLayout from "@/components/Layouts/DashboardLayout.tsx";
import { useAuth } from "@/features/auth/hooks.ts";
import { useDomain } from "@/hooks/useDomain.ts";
import { Spinner } from "@repo/ui";
import { useCallback, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
export const ProtectedRoute = () => {
  const { userSession } = useAuth();

  const navigate = useNavigate();
  const {
    data: { domains },
    services: { getDomainService },
  } = useDomain();

  const { domainId } = useParams();

  const handleDomainRedirect = useCallback(() => {
    if (!domainId && domains && domains.length > 0) {
      navigate(`/dashboard/${domains[0]?.id}`, { replace: true });
    }
  }, [domainId, domains, navigate]);

  useEffect(() => {
    handleDomainRedirect();
  }, [handleDomainRedirect]);

  /* ---------------- AUTH LOADING ---------------- */

  // auth api loading
  if (userSession.isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner variant="primary" />
      </div>
    );
  }

  // user not loggedin
  if (!userSession.data?.session) {
    return <Navigate to="/login" replace />;
  }

  // domain loading
  if (getDomainService.isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner variant="primary" />
      </div>
    );
  }

  // No domains
  if (domains && domains.length === 0) {
    return <Navigate to="/onboarding/create-domain" replace />;
  }

  return <DashboardLayout />;
};
