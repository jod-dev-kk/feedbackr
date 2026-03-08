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
    if (
      !domainId &&
      domains &&
      domains?.length > 0 &&
      !getDomainService.isPending
    ) {
      navigate(`/dashboard/${domains[0]?.id}`, { replace: true });
    }
  }, [domains, navigate]);

  useEffect(() => {
    console.log("protected mounted");

    handleDomainRedirect();
  }, [handleDomainRedirect]);
  if (userSession.isPending) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <Spinner variant="primary" />
      </div>
    );
  }
  if (!userSession.data?.session) {
    return <Navigate to={"/login"} />;
  }

  // instead of creating seperate function to add domain global routing checks. i added this inside protected route
  if (domains && domains?.length <= 0) {
    return <Navigate to={"/onboarding/create-domain"} />;
  }
  return <DashboardLayout />;
};
