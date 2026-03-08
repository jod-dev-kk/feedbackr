import { useAuth } from "@/features/auth/hooks.ts";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useDomain } from "./useDomain.ts";

interface UseDomainRedirectProps {
  onNoDomains?: () => void; // Custom handler for no domains
}

export const useDomainRedirect = ({
  onNoDomains,
}: UseDomainRedirectProps = {}) => {
  const { userSession } = useAuth();
  const navigate = useNavigate();
  const {
    data: { domains },
    services: { getDomainService },
  } = useDomain();
  const handleRedirect = useCallback(() => {
    // 401 → login
    if (getDomainService.error?.response?.status === 401) {
      toast.error(
        getDomainService.error.response.data?.message || "Session expired",
      );
      navigate("/login", { replace: true });
      return;
    }

    // Still processing
    if (
      getDomainService.isLoading ||
      getDomainService.isPending ||
      getDomainService.error
    ) {
      return;
    }

    // // Has domains → dashboard
    if (domains && domains?.[0]?.id) {
      toast.info(`Redirecting to ${domains[0].name}`);
      navigate(`/dashboard/${domains[0].id}`, { replace: true });
      return;
    }

    // No domains → custom handler or default
    if (onNoDomains) {
      onNoDomains();
    } else {
      navigate("/onboarding/create-domain", { replace: true });
    }
  }, [
    getDomainService.error,
    getDomainService.isLoading,
    getDomainService.isPending,
    domains,
    navigate,
    onNoDomains,
  ]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return {
    isRedirecting: getDomainService.isLoading || getDomainService.isPending,
    hasError: !!getDomainService.error,
    domains,
  };
};
